import { ThemedView } from "@/components/themed-view";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type TodayGoalCardProps = {
  completed: number;
  goal: number;
  onPressEdit?: () => void;
};

export function TodayGoalCard({
  completed,
  goal,
  onPressEdit,
}: TodayGoalCardProps) {
  const progress = Math.min(completed / goal, 1);
  const percent = Math.round(progress * 100);
  const isCompleted = completed >= goal;

  return (
    <ThemedView type="backgroundElement"style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Today's Goal</Text>

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

      <View style={styles.footer}>
        <View style={styles.info}>
          <Text style={styles.percent}>
            {isCompleted ? "Completed 🎉" : `${percent}% Completed`}
          </Text>

          <Text style={styles.description}>
            {isCompleted
              ? "Great job today!"
              : `${goal - completed} sessions remaining`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={onPressEdit}
        >
          <Text style={styles.buttonText}>
            Edit Goal
          </Text>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 12,
    borderRadius: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    color: "#000000",
    fontSize: 18,
    fontWeight: "700",
  },

  count: {
    color: "#FF7A00",
    fontSize: 18,
    fontWeight: "700",
  },

  progressTrack: {
    overflow: "hidden",

    height: 10,

    borderRadius: 999,

    backgroundColor: "#ECECEC",
  },

  progressBar: {
    height: "100%",

    borderRadius: 999,

    backgroundColor: "#FF7A00",
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    gap: 16,
  },

  info: {
    flex: 1,
    gap: 4,
  },

  percent: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "600",
  },

  description: {
    color: "#666666",
    fontSize: 13,
  },

  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 14,

    backgroundColor: "#FF7A00",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});