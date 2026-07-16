export const FOCUS_KEY = '@pomodoro_focus_time';
export const BREAK_KEY = '@pomodoro_break_time';
export const DAILY_GOAL_KEY = "daily_goal";
export const DAILY_COMPLETED_KEY = "daily_completed";
export const DAILY_DATE_KEY = "daily_date";
export const STREAK_KEY = "streak";
export const WeeklY_KEY = "weekly_goal";
export const ACHIEVEMENT_KEY = "achievement_progress";
export const HISTORY_KEY = "history_pomodoro";

export interface WeeklyGoalData {
  week: string;
  completed: number;
  goal: number;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
}

export type AchievementType =
  | "session"
  | "streak"
  | "focusHour";

export interface AchievementProgress {
  progress: number;
  unlocked: string[];
}

export interface AchievementStorage {
  session: AchievementProgress;
  streak: AchievementProgress;
  focusHour: AchievementProgress;
}

export const DEFAULT_ACHIEVEMENT: AchievementStorage = {
  session: {
    progress: 0,
    unlocked: [],
  },
  streak: {
    progress: 0,
    unlocked: [],
  },
  focusHour: {
    progress: 0,
    unlocked: [],
  },
};

export const ACHIEVEMENTS = [
  {
    id: "first_focus",
    type: "session",
    title: "First Focus",
    icon: "🏆",
    target: 1,
  },
  {
    id: "10_sessions",
    type: "session",
    title: "10 Sessions",
    icon: "🥉",
    target: 10,
  },
  {
    id: "7_day_streak",
    type: "streak",
    title: "7 Day Streak",
    icon: "🔥",
    target: 7,
  },
  {
    id: "100_hours",
    type: "session",
    title: "100 goal",
    icon: "⭐",
    target: 100,
  },
  {
    id: "365_days",
    type: "streak",
    title: "365 Days",
    icon: "👑",
    target: 365,
  },
] as const;



export type SessionType =
  | "focus"
  | "shortBreak"
  | "longBreak";

export type SessionStatus =
  | "completed"
  | "cancelled"
  | "skipped";

export interface HistorySession {
  type: SessionType;
  startedAt: string; // ISO string
  duration: number;
  status: SessionStatus;
  title: string;
}

export interface HistoryPomo {
  title: string;
  sessions: HistorySession[];
}


