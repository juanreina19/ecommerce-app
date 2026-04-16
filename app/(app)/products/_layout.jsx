import { Stack } from "expo-router";

export default function ProductsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown:  false,
        contentStyle: { backgroundColor: "#0F0F14" },
        animation:    "slide_from_right",
      }}
    />
  );
}
