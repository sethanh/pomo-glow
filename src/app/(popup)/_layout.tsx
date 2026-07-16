import { Stack } from "expo-router";

export default function PopupLayout() {
  return (
    <Stack
        screenOptions={{
        headerShown: false,
      }}
    />
  );
}