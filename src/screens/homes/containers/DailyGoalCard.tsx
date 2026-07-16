import { StyleSheet, Text, View } from "react-native";

type DailyGoalCardProps = {
  completed: number;
  goal: number;
};

export function DailyGoalCard({
  completed,
  goal,
}: DailyGoalCardProps) {
  const progress = Math.min(completed / goal, 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{`Today's Goal `}</Text>

        <Text style={styles.count}>
          {completed}/{goal}
        </Text>
      </View>

      <View style={styles.progressBackground}>
        <View
          style={[
            styles.progress,
            {
              width: `${progress * 100}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.subtitle}>
        {Math.round(progress * 100)}% completed
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 24,
    backgroundColor: "#171717",
    borderWidth: 1,
    borderColor: "#2B2B2B",
    gap: 8
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },

  count: {
    color: "#FF7A00",
    fontSize: 18,
    fontWeight: "700",
  },

  progressBackground: {

    height: 10,

    borderRadius: 99,

    overflow: "hidden",

    backgroundColor: "#2C2C2C",
  },

  progress: {
    height: "100%",

    borderRadius: 99,

    backgroundColor: "#FF7A00",
  },

  subtitle: {

    color: "#9E9E9E",

    fontSize: 14,
  },
});