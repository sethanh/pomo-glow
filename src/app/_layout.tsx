import { DefaultTheme, Stack, ThemeProvider } from "expo-router";

import { AnimatedSplashOverlay } from "@/components/animated-icon";

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AnimatedSplashOverlay />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="(popup)"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}