import { Stack } from "expo-router";

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#0284c7",
        },
        headerTintColor: "#ffffff",
        headerTitleStyle: {
          fontWeight: "600" as const,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Cargo Marketplace",
        }}
      />
      <Stack.Screen
        name="cargo/[id]"
        options={{
          title: "Cargo Details",
        }}
      />
    </Stack>
  );
}
