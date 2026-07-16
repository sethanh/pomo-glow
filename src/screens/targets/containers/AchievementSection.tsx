import { ACHIEVEMENTS, AchievementStorage } from "@/constants";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AchievementCard } from "./AchievementCard";

interface Props {
    data: AchievementStorage;
}

export function AchievementSection({
    data,
}: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Achievements
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
            >
                {ACHIEVEMENTS.map((item) => {
                    const state = data[item.type];

                    const unlocked = state.progress >= item.target;

                    return (
                        <AchievementCard
                            key={item.id}
                            icon={item.icon}
                            title={item.title}
                            unlocked={unlocked}
                            progress={
                                unlocked
                                    ? undefined
                                    : `${state.progress} / ${item.target}`
                            }
                        />
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        gap: 16,
    },

    title: {
        fontSize: 20,

        fontWeight: "700",

        color: "#000",
    },

    list: {
        gap: 12,

        paddingRight: 20,
    },
});