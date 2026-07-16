import { AnimatedIcon } from "@/components/animated-icon";
import { StyleSheet, Text, View } from "react-native";

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning ☀️";
    if (hour < 18) return "Good Afternoon ☀️";

    return "Good Evening 🌙";
}

export function Header() {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>{getGreeting()}</Text>
                <Text style={styles.subtitle}>
                    {
                        new Date().toLocaleDateString('en-US', {month: 'short',day: 'numeric', year: 'numeric'})
                    }
                </Text>
            </View>
            <AnimatedIcon />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        gap: 8,
    },
    content: {
        gap: 4,
        alignItems: "center",
    },
    title: {
        fontSize: 28,
        fontWeight: "600",
        color: "#000",
    },
    subtitle: {
        fontSize: 15,
        color: "#000",
    },
});