import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  HISTORY_KEY,
  HistoryPomo,
  HistorySession
} from "@/constants";

const DEFAULT_HISTORY: HistoryPomo[] = [];

export async function getHistorySessions(): Promise<HistoryPomo[]> {
  const value = await AsyncStorage.getItem(HISTORY_KEY);

  if (!value) {
    await AsyncStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(DEFAULT_HISTORY)
    );

    return DEFAULT_HISTORY;
  }

  try {
    return JSON.parse(value);
  } catch {
    return DEFAULT_HISTORY;
  }
}


export async function addHistorySession(
  session: HistorySession
) {
  const sessions = await getHistorySessions();

  var existSession = sessions.find(c => c.title == session.title);

  if(existSession)
  {
    existSession.sessions.push(session);
  }
  else {
    sessions.push({
      title: session.title,
      sessions: [session]
    })
  }

  await AsyncStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(sessions)
  );
}