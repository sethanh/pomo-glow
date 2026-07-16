import { ThemedView } from "@/components/themed-view";
import { StyleSheet, Text, View } from "react-native";

type WeeklyGoalCardProps = {
  completed: number;
  goal: number;
};

export function WeeklyGoalCard({
  completed,
  goal,
}: WeeklyGoalCardProps) {
  const progress = Math.min(completed / goal, 1);
  const percent = Math.round(progress * 100);
  const isCompleted = completed >= goal;

  return (
    <ThemedView type="backgroundElement" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          This Week
        </Text>

        <Text style={styles.count}>
          {completed}/{goal}
        </Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.percent}>
          {isCompleted ? "Completed 🎉" : `${percent}% Completed`}
        </Text>

        <Text style={styles.description}>
          {isCompleted
            ? "Excellent work this week!"
            : `${goal - completed} sessions remaining`}
        </Text>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
    padding: 20,
    borderRadius: 8,
  },

  header: {
    flexDirection: "row",

    justifyContent: "space-between",

    alignItems: "center",
  },

  title: {
    fontSize: 18,

    fontWeight: "700",

    color: "#000000",
  },

  count: {
    fontSize: 18,

    fontWeight: "700",

    color: "#FF7A00",
  },

  progressTrack: {
    height: 10,

    borderRadius: 999,

    overflow: "hidden",

    backgroundColor: "#ECECEC",
  },

  progressBar: {
    height: "100%",

    borderRadius: 999,

    backgroundColor: "#FF7A00",
  },

  info: {
    gap: 4,
  },

  percent: {
    fontSize: 15,

    fontWeight: "600",

    color: "#000000",
  },

  description: {
    fontSize: 13,

    color: "#666666",
  },
});