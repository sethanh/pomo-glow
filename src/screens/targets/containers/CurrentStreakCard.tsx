import { ThemedView } from "@/components/themed-view";
import { StyleSheet, Text, View } from "react-native";

type CurrentStreakCardProps = {
  currentStreak: number;
  bestStreak: number;
};

export function CurrentStreakCard({
  currentStreak,
  bestStreak,
}: CurrentStreakCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🔥</Text>
        <Text style={styles.title}>
          Current Streak
        </Text>
      </View>
      <ThemedView type="backgroundElement" style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.value}>
            {currentStreak} Days
          </Text>

          <Text style={styles.subtitle}>
            Keep your momentum going
          </Text>
        </View>

        <View style={styles.right}>
          <Text style={styles.label}>
            Best Streak
          </Text>

          <Text style={styles.best}>
            {bestStreak} Days
          </Text>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    borderRadius: 24,
  },

  header: {
    flexDirection: "row",

    alignItems: "center",

    gap: 8,
  },

  emoji: {
    fontSize: 22,
  },

  title: {
    fontSize: 18,

    fontWeight: "700",

    color: "#000000",
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    padding: 20,
    borderRadius: 8
  },

  left: {
    gap: 4,
  },

  value: {
    fontSize: 30,

    fontWeight: "700",

    color: "#000000",
  },

  subtitle: {
    fontSize: 14,

    color: "#666666",
  },

  right: {
    alignItems: "flex-end",

    gap: 4,
  },

  label: {
    fontSize: 13,

    color: "#999999",
  },

  best: {
    fontSize: 18,

    fontWeight: "600",

    color: "#FF7A00",
  },
});