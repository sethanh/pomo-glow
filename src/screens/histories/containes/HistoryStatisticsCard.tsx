import { StyleSheet, Text, View } from "react-native";

type HistoryStatisticsCardProps = {
  sessions: number;
  focusMinutes: number;
  longestSession: number;
  completionRate: number;
};

export function HistoryStatisticsCard({
  sessions,
  focusMinutes,
  longestSession,
  completionRate,
}: HistoryStatisticsCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today</Text>

      <View style={styles.grid}>
        <StatisticItem
          value={sessions.toString()}
          label="Sessions"
        />

        <StatisticItem
          value={`${focusMinutes}m`}
          label="Focus Time"
        />

        <StatisticItem
          value={`${longestSession}m`}
          label="Longest"
        />

        <StatisticItem
          value={`${completionRate}%`}
          label="Completed"
        />
      </View>
    </View>
  );
}

type StatisticItemProps = {
  value: string;
  label: string;
};

function StatisticItem({
  value,
  label,
}: StatisticItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.value}>
        {value}
      </Text>

      <Text style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
  },

  title: {
    fontSize: 20,

    fontWeight: "700",

    color: "#000000",
  },

  grid: {
    flexDirection: "row",

    flexWrap: "wrap",

    gap: 12,
  },

  item: {
    flex: 1,

    minWidth: "45%",

    gap: 4,

    padding: 16,

    borderRadius: 16,

    backgroundColor: "#F5F5F7",
  },

  value: {
    fontSize: 24,

    fontWeight: "700",

    color: "#000000",
  },

  label: {
    fontSize: 14,

    color: "#6B7280",
  },
});