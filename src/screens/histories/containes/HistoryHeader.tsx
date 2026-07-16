import { StyleSheet, Text, View } from "react-native";

export function HistoryHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>

      <Text style={styles.subtitle}>
        Review your completed focus sessions and track your productivity over
        time.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    alignItems: 'center'
  },

  title: {
    fontSize: 34,
    fontWeight: "700",

    color: "#000000",

    letterSpacing: -0.5,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    color: "#6B7280",
  },
});