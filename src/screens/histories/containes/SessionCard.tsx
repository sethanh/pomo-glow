import { HistorySession, SessionType } from "@/constants";
import { StyleSheet, Text, View } from "react-native";

type SessionCardProps = {
  session: HistorySession;
};

const SESSION_CONFIG = {
  focus: {
    title: "Focus Session",
    icon: "🍅",
  },
  shortBreak: {
    title: "Short Break",
    icon: "☕",
  },
  longBreak: {
    title: "Long Break",
    icon: "🌙",
  },
} satisfies Record<
  SessionType,
  {
    title: string;
    icon: string;
  }
>;

export function SessionCard({
  session,
}: SessionCardProps) {
  const config = SESSION_CONFIG[session.type];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.icon}>
            {config.icon}
          </Text>

          <Text style={styles.title}>
            {config.title}
          </Text>
        </View>

        <Text
          style={[
            styles.status,
            session.status === "cancelled" &&
              styles.cancelled,
          ]}
        >
          {session.status === "completed"
            ? "Completed"
            : "Cancelled"}
        </Text>
      </View>

      <Text style={styles.detail}>
        {session.startedAt} • {session.duration} min
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,

    padding: 16,

    borderRadius: 20,

    backgroundColor: "#FFFFFF",
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",
  },

  titleContainer: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,
  },

  icon: {
    fontSize: 20,
  },

  title: {
    fontSize: 16,

    fontWeight: "600",

    color: "#000000",
  },

  status: {
    fontSize: 13,

    fontWeight: "600",

    color: "#16A34A",
  },

  cancelled: {
    color: "#DC2626",
  },

  detail: {
    fontSize: 14,

    color: "#6B7280",
  },
});