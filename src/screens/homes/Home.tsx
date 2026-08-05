import { AudioModule, useAudioPlayer } from 'expo-audio';
import * as Notifications from 'expo-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BREAK_KEY, FOCUS_KEY } from '@/constants';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import {
  addHistorySession,
  getDailyProgress,
  increaseAchievementProgress,
  increaseCompletedSessions,
  increaseStreak,
} from '@/hooks';
import { increaseWeeklyCompleted } from '@/hooks/week-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { DailyGoalCard, Header } from './containers';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState(0);
  const [focusTime, setFocusTime] = useState(25);
  const [breakTime, setBreakTime] = useState(5);
  const [goal, setGoal] = useState(5);
  const [completed, setCompleted] = useState(0);
  const [isFocus, setIsFocus] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(true);

  const finishPlayer = useAudioPlayer(require('@/assets/sounds/finish.mp3'));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const endTimeRef = useRef<number | null>(null); // thời điểm kết thúc (timestamp)
  const notificationIdRef = useRef<string | null>(null);

  // Cho phép phát âm thanh khi ở chế độ im lặng
  useEffect(() => {
    AudioModule.setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'mixWithOthers',
    });
  }, []);

  // Xin quyền notification
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permission not granted');
      }
    })();
  }, []);

  // Xử lý khi app vào / ra background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isRunning && endTimeRef.current) {
        const now = Date.now();
        const remaining = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));

        setTimeLeft(remaining);

        if (remaining === 0) {
          handleTimerComplete();
        }
      }
    });

    return () => subscription.remove();
  }, [isRunning]);

  const cancelScheduledNotification = async () => {
    if (notificationIdRef.current) {
      await Notifications.cancelScheduledNotificationAsync(notificationIdRef.current);
      notificationIdRef.current = null;
    }
  };

  const scheduleEndNotification = async (seconds: number, nextIsFocus: boolean) => {
    await cancelScheduledNotification();

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: nextIsFocus ? 'Break Time!' : 'Focus Time!',
        body: nextIsFocus
          ? 'Time to take a break 🎉'
          : "Let's focus again! 💪",
        sound: 'finish.mp3', // tên file trong assets/sounds (đã khai báo trong app.json)
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: seconds,
        repeats: false,
      },
    });

    notificationIdRef.current = id;
  };

  const handleTimerComplete = useCallback(async () => {
    // Phát âm thanh nếu app đang mở
    try {
      finishPlayer.seekTo(0);
      finishPlayer.play();
    } catch (e) {}

    setIsRunning(false);
    setIsFinished(true);
    endTimeRef.current = null;
    await cancelScheduledNotification();

    const nextIsFocus = !isFocus;
    const now = new Date();

    if (isFocus) {
      increaseCompletedSessions();
      increaseWeeklyCompleted();
      increaseAchievementProgress('session');
      addHistorySession({
        title: now.toISOString().slice(0, 10),
        duration: focusTime,
        startedAt: now.toISOString(),
        type: 'focus',
        status: 'completed',
      });

      const newCompleted = completed + 1;
      setCompleted(newCompleted);

      if (newCompleted >= goal) {
        increaseStreak();
        increaseAchievementProgress('streak');
      }
    } else {
      addHistorySession({
        title: now.toISOString().slice(0, 10),
        duration: breakTime,
        startedAt: now.toISOString(),
        type: 'shortBreak',
        status: 'completed',
      });
    }

    const nextTime = nextIsFocus ? focusTime * 60 : breakTime * 60;
    setTimeLeft(nextTime);
    setIsFocus(nextIsFocus);
  }, [isFocus, focusTime, breakTime, finishPlayer, completed, goal]);

  // Load settings
  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        try {
          const [savedFocus, savedBreak, progress] = await Promise.all([
            AsyncStorage.getItem(FOCUS_KEY),
            AsyncStorage.getItem(BREAK_KEY),
            getDailyProgress(),
          ]);

          const newFocus = parseInt(savedFocus || '25', 10);
          const newBreak = parseInt(savedBreak || '5', 10);

          setGoal(progress.goal);
          setCompleted(progress.completed);
          setFocusTime(newFocus);
          setBreakTime(newBreak);

          if (isFinished) {
            setTimeLeft(isFocus ? newFocus * 60 : newBreak * 60);
          }
        } catch (e) {
          console.error('Load settings failed:', e);
        }
      };
      loadSettings();
    }, [isFinished, isFocus])
  );

  const ensureNotificationPermission = useCallback(async () => {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    if (existingStatus === 'granted') return;

    // Show explanation before the system permission prompt
    await new Promise<void>((resolve) => {
      Alert.alert(
        'Notifications',
        'You need permission to receive notifications when PomoGlow ends.',
        [
          {
            text: 'Skip',
            style: 'cancel',
            onPress: () => resolve(),
          },
          {
            text: 'Allow',
            onPress: async () => {
              await Notifications.requestPermissionsAsync();
              resolve();
            },
          },
        ]
      );
    });
  }, []);

  const startCountdown = useCallback(async () => {
    console.log(isFocus, isFinished);
    if (isFocus && isFinished) {
      await ensureNotificationPermission();
    }
    const seconds = timeLeft > 0 ? timeLeft : (isFocus ? focusTime : breakTime) * 60;

    setTimeLeft(seconds);
    setIsRunning(true);
    setIsFinished(false);

    endTimeRef.current = Date.now() + seconds * 1000;

    // Schedule notification chính xác
    await scheduleEndNotification(seconds, !isFocus);
  }, [timeLeft, isFocus, focusTime, breakTime, isFinished]);

  const stopCountdown = useCallback(async () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
    endTimeRef.current = null;
    await cancelScheduledNotification();
  }, []);

  const skipRelax = useCallback(async () => {
    await stopCountdown();

    const now = new Date();
    addHistorySession({
      title: now.toISOString().slice(0, 10),
      duration: breakTime,
      startedAt: now.toISOString(),
      type: 'shortBreak',
      status: 'skipped',
    });

    setTimeLeft(focusTime * 60);
    setIsFocus(true);
    setIsFinished(true);
  }, [focusTime, breakTime, stopCountdown]);

  const toggleCountdown = useCallback(() => {
    if (isRunning) {
      if (!isFocus) return skipRelax();
      return stopCountdown();
    }
    return startCountdown();
  }, [isRunning, isFocus, skipRelax, stopCountdown, startCountdown]);

  // Interval chỉ chạy khi app đang foreground
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopCountdown();
          handleTimerComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, stopCountdown, handleTimerComplete]);

  // Format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');

  const buttonText =
    isRunning && isFocus
      ? 'Pause'
      : isRunning && !isFocus
      ? 'Skip'
      : !isFocus && isFinished
      ? 'Break'
      : isFocus && !isRunning && !isFinished
      ? 'Resume'
      : 'Play';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedView style={styles.heroSection}>
          <Header />
          <DailyGoalCard completed={completed} goal={goal} />
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          POMODORO
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <ThemedView style={styles.tickTockWrapper} type="backgroundElement">
            <ThemedView style={styles.timeGroup}>
              <ThemedView style={[styles.tickTockView, !isFocus && styles.tickTockViewBreak]}>
                <ThemedText type="title" style={styles.tickTockText}>
                  {displayMinutes}
                </ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.timeGroup}>
              <ThemedView style={[styles.tickTockView, !isFocus && styles.tickTockViewBreak]}>
                <ThemedText type="title" style={styles.tickTockText}>
                  {displaySeconds}
                </ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>

          <ThemedText
            type="small"
            style={[styles.button, !isFocus && styles.tickTockViewBreak]}
            onPress={toggleCountdown}
          >
            {buttonText}
          </ThemedText>
        </ThemedView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', flexDirection: 'row' },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: 4,
  },
  code: {
    padding: 12,
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
  },
  stepContainer: {
    gap: Spacing.one,
    alignSelf: 'stretch',
    padding: 24,
    borderRadius: Spacing.four,
    alignItems: 'center',
  },
  tickTockWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    borderRadius: 12,
  },
  timeGroup: {
    alignItems: 'center',
    gap: 6,
    borderRadius: 12,
  },
  tickTockView: {
    width: 84,
    height: 90,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#333',
  },
  tickTockViewBreak: {
    backgroundColor: '#333',
  },
  tickTockText: {
    color: 'white',
  },
  button: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#E23E28',
    borderRadius: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});