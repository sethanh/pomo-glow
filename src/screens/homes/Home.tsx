import { useAudioPlayer } from 'expo-audio';
import * as BackgroundFetch from 'expo-background-fetch';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BREAK_KEY, FOCUS_KEY } from '@/constants';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { addHistorySession, getDailyProgress, increaseAchievementProgress, increaseCompletedSessions, increaseStreak } from '@/hooks';
import { increaseWeeklyCompleted } from '@/hooks/week-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { DailyGoalCard, Header } from './containers';

// Định nghĩa Task Name
const BACKGROUND_TIMER_TASK = 'pomodoro-background-timer';

TaskManager.defineTask(BACKGROUND_TIMER_TASK, async () => {
  try {
    // Logic chạy ngầm (có thể cập nhật AsyncStorage hoặc gửi notification)
    console.log('Background task running...');
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
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

  const tickPlayer = useAudioPlayer(require('@/assets/sounds/tick.mp3'));
  const finishPlayer = useAudioPlayer(require('@/assets/sounds/finish.mp3'));

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastBackgroundTimeRef = useRef<number>(Date.now());

  const loadGoal = useCallback(async () => {
    const progress = await getDailyProgress();

    setGoal(progress.goal);
    setCompleted(progress.completed);
  }, []);

  // Register background task
  useEffect(() => {
    const registerBackgroundTask = async () => {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_TIMER_TASK, {
        minimumInterval: 1, // 1 giây
        stopOnTerminate: false,
        startOnBoot: true,
      });
    };

    if (Platform.OS !== 'web') {
      registerBackgroundTask();
    }

    return () => {
      if (Platform.OS !== 'web') {
        BackgroundFetch.unregisterTaskAsync(BACKGROUND_TIMER_TASK);
      }
    };
  }, []);

  // Xử lý khi app vào foreground sau khi bị khoá
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active' && isRunning) {
        const now = Date.now();
        const secondsPassed = Math.floor((now - lastBackgroundTimeRef.current) / 1000);

        if (secondsPassed > 0 && timeLeft > 0) {
          const newTimeLeft = Math.max(0, timeLeft - secondsPassed);
          setTimeLeft(newTimeLeft);

          if (newTimeLeft === 0) {
            // Hoàn thành khi quay lại foreground
            handleTimerComplete();
          }
        }
      } else if (nextAppState === 'background' && isRunning) {
        lastBackgroundTimeRef.current = Date.now();
      }
    });

    return () => subscription.remove();
  }, [isRunning, timeLeft]);

  const handleTimerComplete = useCallback(() => {
    finishPlayer.seekTo(0);
    finishPlayer.play();

    setIsFinished(true);
    const nextIsFocus = !isFocus;
    const now = new Date();

    if (isFocus) {
      increaseCompletedSessions();
      increaseWeeklyCompleted();
      increaseAchievementProgress( "session");
      addHistorySession({
        title: now.toISOString().slice(0, 10), // YYYY-MM-DD
        duration: focusTime,
        startedAt: now.toISOString(),
        type:'focus',
        status: 'completed'
      });

      let currentGoal = goal + 1;
      if (currentGoal == completed) {
        increaseStreak();
        increaseAchievementProgress("streak");
      }
      setGoal(currentGoal);
    }

    if (!focusTime) {
      addHistorySession({
        title: now.toISOString().slice(0, 10), // YYYY-MM-DD
        duration: focusTime,
        startedAt: now.toISOString(),
        type: 'shortBreak',
        status: 'completed'
      });
    }

    const nextTime = nextIsFocus ? focusTime * 60 : breakTime * 60;

    setTimeLeft(nextTime);
    setIsFocus(nextIsFocus);

    Notifications.scheduleNotificationAsync({
      content: {
        title: nextIsFocus ? 'Focus Time!' : 'Break Time!',
        body: nextIsFocus ? "Let's focus again! 💪"
          : "Time to take a break 🎉",
      },
      trigger: null,
    });
  }, [isFocus, focusTime, breakTime, finishPlayer]);

  // Load settings
  useFocusEffect(
    useCallback(() => {
      const loadSettings = async () => {
        try {
          const [savedFocus, savedBreak] = await Promise.all([
            AsyncStorage.getItem(FOCUS_KEY),
            AsyncStorage.getItem(BREAK_KEY),
          ]);

          const newFocus = parseInt(savedFocus || '25', 10);
          const newBreak = parseInt(savedBreak || '5', 10);

          setFocusTime(newFocus);
          setBreakTime(newBreak);

          if (isFinished) {
            setTimeLeft(isFocus ? newFocus * 60 : newBreak * 60);
          }
        } catch (e) {
          console.error('Load settings failed:', e);
        }
      };

      loadGoal();
      loadSettings();
    }, [isRunning, isFinished, isFocus])
  );

  const startCountdown = useCallback(() => {
    setIsRunning(true);
    setIsFinished(false);
    lastBackgroundTimeRef.current = Date.now();
  }, []);

  const stopCountdown = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    tickPlayer.pause();
    setIsRunning(false);
  }, [tickPlayer]);

  const skipRelax = useCallback(() => {
    const now = new Date();
    addHistorySession({
        title: now.toISOString().slice(0, 10), // YYYY-MM-DD
        duration: focusTime,
        startedAt: now.toISOString(),
        type:'shortBreak',
        status: 'skipped'
    });
    setTimeLeft(focusTime * 60);
    setIsFocus(true);
    setIsFinished(false);
  }, [focusTime]);

  const toggleCountdown = useCallback(() => {
    if (isRunning) {
      if (!isFocus) return skipRelax();
      return stopCountdown();
    }
    return startCountdown();
  }, [isRunning, isFocus, skipRelax, stopCountdown, startCountdown]);

  // Main interval (chỉ chạy khi foreground)
  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          stopCountdown();
          handleTimerComplete();
          return 0;
        }

        if (isFocus) {
          tickPlayer.seekTo(0).catch(() => { });
          tickPlayer.volume = 0.4;
          tickPlayer.play();
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isFocus, focusTime, breakTime, stopCountdown, tickPlayer, handleTimerComplete]);

  // Format
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');

  const buttonText = isRunning && isFocus
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
                <ThemedText type="title" style={styles.tickTockText}>{displayMinutes}</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.timeGroup}>
              <ThemedView style={[styles.tickTockView, !isFocus && styles.tickTockViewBreak]}>
                <ThemedText type="title" style={styles.tickTockText}>{displaySeconds}</ThemedText>
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

        {/* <TodaySummaryCard
          sessions={6}
          focusMinutes={150}
          streak={7}
          goalPercent={60}
        /> */}
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
    gap: 2
  },
  code: {
    textTransform: 'uppercase',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
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
  },
  timeGroup: {
    alignItems: 'center',
    gap: 6,
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