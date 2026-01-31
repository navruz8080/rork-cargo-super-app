import { Stack } from "expo-router";

export default function TrackingLayout() {
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
          title: "Track Shipment",
        }}
      />
    </Stack>
  );
}
