import { StyleSheet, Text, View } from "react-native";

import { HistorySession } from "@/constants";
import { SessionCard } from "./SessionCard";

type HistoryTimelineProps = {
  sections: {
    title: string;
    sessions: HistorySession[];
  }[];
};

export function HistoryTimeline({
  sections,
}: HistoryTimelineProps) {
  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <View
          key={section.title}
          style={styles.section}
        >
          <Text style={styles.title}>
            {section.title}
          </Text>

          <View style={styles.list}>
            {section.sessions.map((session, index) => (
              <SessionCard
                key={index}
                session={session}
              />
            ))}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    width: '100%',
    paddingHorizontal: 20
  },

  section: {
    gap: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",

    color: "#000000",
  },

  list: {
    gap: 12,
  },
});