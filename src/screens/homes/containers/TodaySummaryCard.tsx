import { StyleSheet, Text, View } from "react-native";

type TodaySummaryCardProps = {
  sessions: number;
  focusMinutes: number;
  streak: number;
  goalPercent: number;
};

export function TodaySummaryCard({
  sessions,
  focusMinutes,
  streak,
  goalPercent,
}: TodaySummaryCardProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Today's Summary
      </Text>

      <View style={styles.grid}>
        <SummaryItem
          emoji="🍅"
          value={sessions.toString()}
          label="Sessions"
        />

        <SummaryItem
          emoji="⏱"
          value={`${focusMinutes}m`}
          label="Focus Time"
        />

        <SummaryItem
          emoji="🔥"
          value={`${streak} Days`}
          label="Streak"
        />

        <SummaryItem
          emoji="🎯"
          value={`${goalPercent}%`}
          label="Goal"
        />
      </View>
    </View>
  );
}

type SummaryItemProps = {
  emoji: string;
  value: string;
  label: string;
};

function SummaryItem({
  emoji,
  value,
  label,
}: SummaryItemProps) {
  return (
    <View style={styles.item}>
      <Text style={styles.icon}>
        {emoji}
      </Text>

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
    marginTop: 28,

    padding: 20,

    borderRadius: 24,

    backgroundColor: "#171717",

    borderWidth: 1,
    borderColor: "#2A2A2A",
  },

  title: {
    color: "#FFFFFF",

    fontSize: 18,

    fontWeight: "700",

    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent: "space-between",
  },

  item: {
    width: "48%",

    alignItems: "center",

    paddingVertical: 18,

    marginBottom: 14,

    borderRadius: 18,

    backgroundColor: "#202020",
  },

  icon: {
    fontSize: 28,
  },

  value: {
    marginTop: 8,

    color: "#FFFFFF",

    fontSize: 22,

    fontWeight: "700",
  },

  label: {
    marginTop: 4,

    color: "#9E9E9E",

    fontSize: 13,
  },
});