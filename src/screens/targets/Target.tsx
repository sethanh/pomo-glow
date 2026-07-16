import { ThemedView } from '@/components/themed-view';
import { DEFAULT_ACHIEVEMENT } from '@/constants';
import { getAchievements, getDailyProgress, getStreak } from '@/hooks';
import { getWeeklyGoal } from '@/hooks/week-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { AchievementSection, CurrentStreakCard, TargetHeader, TodayGoalCard, WeeklyGoalCard } from './containers';

export function TargetScreen() {
  const router = useRouter();
  const [goal, setGoal] = useState(5);
  const [completed, setCompleted] = useState(0);
  const [streak, setStreak] = useState({
    currentStreak: 0,
    bestStreak: 0,
  });

  const [weekly, setWeekly] = useState({
    completed: 0,
    goal: 40,
  });

  const [achievement, setAchievement] = useState(DEFAULT_ACHIEVEMENT);

  useFocusEffect(
    useCallback(() => {
      const loading = async () => {
        const [progress, streakData, weeklyGoal, achievementData] = await Promise.all([
          getDailyProgress(),
          getStreak(),
          getWeeklyGoal(),
          getAchievements()
        ]);

        setGoal(progress.goal);
        setCompleted(progress.completed);

        setStreak(streakData);
        setWeekly(weeklyGoal);
        setAchievement(achievementData);
      };
      loading();
    }, [])
  );

  return (
    <SafeAreaView
      edges={["top"]}
      style={styles.safeArea}
    >

      <ThemedView style={styles.container}>
        <TargetHeader />
        <TodayGoalCard
          completed={completed}
          goal={goal}
          onPressEdit={() => router.navigate('/(popup)/goal')}
        />
        <CurrentStreakCard  
          currentStreak={streak.currentStreak}
          bestStreak={streak.bestStreak}
        />
        <WeeklyGoalCard
          completed={weekly.completed}
          goal={weekly.goal}
        />
        <AchievementSection
          data={achievement}
         />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    gap: 12,
    position: 'relative'
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'white'
  },
}
);
