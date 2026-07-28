import { DAILY_COMPLETED_KEY, DAILY_DATE_KEY, DAILY_GOAL_KEY } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { resetStreak } from "./streak-storage";


const today = () => new Date().toISOString().slice(0, 10);

async function resetIfNeeded() {
  const savedDate = await AsyncStorage.getItem(DAILY_DATE_KEY);

  if (savedDate !== today()) {
    const [goal, completed] = await Promise.all([
        getDailyGoal(),
        getCompletedSessions(),
    ]);

    if(completed < goal) {
        resetStreak();
    }
    
    await AsyncStorage.multiSet([
      [DAILY_DATE_KEY, today()],
      [DAILY_GOAL_KEY, "0"],
    ]);
  }
}

export async function UpdateTargetGoal(target: number) {
    await AsyncStorage.setItem(
        DAILY_GOAL_KEY,
        target.toString(),
    );
}

export async function getDailyGoal() {
  const value = await AsyncStorage.getItem(DAILY_GOAL_KEY);
  return Number(value ?? 5) || 5;
}

export async function setDailyGoal(goal: number) {
  await AsyncStorage.setItem(
    DAILY_GOAL_KEY,
    goal.toString(),
  );
}

export async function getCompletedSessions() {
  const value = await AsyncStorage.getItem(
    DAILY_COMPLETED_KEY,
  );

  return Number(value ?? 0);
}

export async function increaseCompletedSessions() {

  const completed = await getCompletedSessions();

  await AsyncStorage.setItem(
    DAILY_COMPLETED_KEY,
    String(completed + 1),
  );
}

export async function getDailyProgress() {
  await resetIfNeeded();

  const [goal, completed] = await Promise.all([
    getDailyGoal(),
    getCompletedSessions(),
  ]);

  return {
    goal,
    completed,
  };
}