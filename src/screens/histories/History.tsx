import {
    HistoryPomo,
} from "@/constants";
import { getHistorySessions } from '@/hooks';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { HistoryHeader } from './containes';
import { HistoryTimeline } from './containes/HistoryTimeline';

export function HistoryScreen() {
    const [history, setHistory] = useState<HistoryPomo[]>([]);

    const today = new Date().toISOString().slice(0, 10);

    const yesterday = (() => {
        const date = new Date();
        date.setDate(date.getDate() - 1);
        return date.toISOString().slice(0, 10);
    })();

    useFocusEffect(
        useCallback(() => {
          const loading = async () => {
            const [historyData] = await Promise.all([
              getHistorySessions(),
            ]);
            setHistory(historyData)
          };
          loading();
        }, [])
      );


    return (
        <SafeAreaView
            edges={["top"]}
            style={styles.safeArea}
        >

            <ScrollView contentContainerStyle={styles.container}>
                <HistoryHeader />
                {/* <HistoryStatisticsCard
                    sessions={6}
                    focusMinutes={150}
                    longestSession={50}
                    completionRate={100}
                /> */}
                <HistoryTimeline
                    sections={[
                        {
                            title: "Today",
                            sessions: history.find(c => c.title === today)?.sessions ?? [],
                        },
                        {
                            title: "Yesterday",
                            sessions: history.find(c => c.title === yesterday)?.sessions ?? [],
                        },
                    ]}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        alignItems: 'center',
        gap: 12
    },
    safeArea: {
        backgroundColor: 'white',
        flex: 1
    },
}
);
