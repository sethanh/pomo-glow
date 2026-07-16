import { StyleSheet, Text, View } from "react-native";

type AchievementCardProps = {
  icon: string;
  title: string;
  progress?: string;
  unlocked: boolean;
};

export function AchievementCard({
  icon,
  title,
  progress,
  unlocked,
}: AchievementCardProps) {
  return (
    <View
      style={[
        styles.container,
        !unlocked && styles.locked,
      ]}
    >
      <Text style={styles.icon}>
        {icon}
      </Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.progress}>
        {unlocked ? "Unlocked" : progress}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 110,

    gap: 8,

    padding: 16,

    borderRadius: 20,

    alignItems: "center",

    backgroundColor: "#FFFFFF",
  },

  locked: {
    opacity: 0.5,
  },

  icon: {
    fontSize: 34,
  },

  title: {
    fontSize: 14,

    fontWeight: "600",

    color: "#000",

    textAlign: "center",
  },

  progress: {
    fontSize: 12,

    color: "#666",

    textAlign: "center",
  },
});