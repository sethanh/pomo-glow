import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  ACHIEVEMENT_KEY,
  AchievementStorage,
  AchievementType,
  DEFAULT_ACHIEVEMENT,
} from "@/constants";

export async function getAchievements(): Promise<AchievementStorage> {
  const value = await AsyncStorage.getItem(ACHIEVEMENT_KEY);

  if (!value) {
    await saveAchievements(DEFAULT_ACHIEVEMENT);
    return DEFAULT_ACHIEVEMENT;
  }

  try {
    return JSON.parse(value);
  } catch {
    return DEFAULT_ACHIEVEMENT;
  }
}

export async function saveAchievements(data: AchievementStorage) {
  await AsyncStorage.setItem(
    ACHIEVEMENT_KEY,
    JSON.stringify(data)
  );
}

export async function updateAchievementProgress(
  type: AchievementType,
  progress: number
) {
  const data = await getAchievements();

  if (progress > data[type].progress) {
    data[type].progress = progress;
    await saveAchievements(data);
  }
}

export async function increaseAchievementProgress(
  type: AchievementType
) {
  const data = await getAchievements();

  data[type].progress += 1;

  await saveAchievements(data);

  return data[type].progress;
}

export async function unlockAchievement(
  type: AchievementType,
  id: string
) {
  const data = await getAchievements();

  if (!data[type].unlocked.includes(id)) {
    data[type].unlocked.push(id);
  }

  await saveAchievements(data);
}

export async function isAchievementUnlocked(
  type: AchievementType,
  id: string
) {
  const data = await getAchievements();

  return data[type].unlocked.includes(id);
}