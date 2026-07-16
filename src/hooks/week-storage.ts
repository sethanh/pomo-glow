import { WeeklY_KEY, WeeklyGoalData } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";


function getCurrentWeek() {
  const now = new Date();

  const start = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - start.getTime()) / 86400000);

  const week = Math.ceil((days + start.getDay() + 1) / 7);

  return `${now.getFullYear()}-W${week}`;
}

export async function getWeeklyGoal(): Promise<WeeklyGoalData> {
  const value = await AsyncStorage.getItem(WeeklY_KEY);

  const currentWeek = getCurrentWeek();

  if (!value) {
    return {
      week: currentWeek,
      completed: 0,
      goal: 40,
    };
  }

  const data: WeeklyGoalData = JSON.parse(value);

  if (data.week !== currentWeek) {
    return {
      week: currentWeek,
      completed: 0,
      goal: data.goal,
    };
  }

  return data;
}

export async function saveWeeklyGoal(data: WeeklyGoalData) {
  await AsyncStorage.setItem(WeeklY_KEY, JSON.stringify(data));
}

export async function increaseWeeklyCompleted() {
  const data = await getWeeklyGoal();

  data.completed++;

  await saveWeeklyGoal(data);
}

export async function UpdateWeeklyTarget(target: number) {
  const data = await getWeeklyGoal();
  data.goal = target;
  await saveWeeklyGoal(data);
}
