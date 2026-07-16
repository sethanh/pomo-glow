import { STREAK_KEY } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";


const defaultValue: StreakData = {
  currentStreak: 0,
  bestStreak: 0,
};

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
}

export async function getStreak(): Promise<StreakData> {
  const value = await AsyncStorage.getItem(STREAK_KEY);

  if (!value) {
    return defaultValue;
  }

  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
}

export async function saveStreak(data: StreakData) {
  await AsyncStorage.setItem(
    STREAK_KEY,
    JSON.stringify(data),
  );
}

export async function increaseStreak() {
  const streak = await getStreak();

  const current = streak.currentStreak + 1;

  await saveStreak({
    currentStreak: current,
    bestStreak: Math.max(current, streak.bestStreak),
  });
}

export async function resetStreak() {
  const streak = await getStreak();

  await saveStreak({
    currentStreak: 0,
    bestStreak: streak.bestStreak,
  });
}