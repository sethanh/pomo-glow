import { StyleSheet, Text, View } from "react-native";

export function TargetHeader() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Goals</Text>

      <Text style={styles.subtitle}>
        Keep building your focus habit.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: 'center',
    gap: 4
  },

  title: {
    fontSize: 30,
    fontWeight: "600",
    color: "#000",
  },

  subtitle: {
    fontSize: 15,
    color: "#000",
  },
});