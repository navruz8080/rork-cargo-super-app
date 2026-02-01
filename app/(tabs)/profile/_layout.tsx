import { Stack } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ProfileLayout() {
  const { t } = useLanguage();
  
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
          title: t.profile,
        }}
      />
      <Stack.Screen
        name="my-shipments"
        options={{
          title: t.myShipments,
        }}
      />
      <Stack.Screen
        name="favorites"
        options={{
          title: t.favorites,
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: t.editProfile,
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="create-shipment"
        options={{
          title: t.createShipment,
        }}
      />
      <Stack.Screen
        name="help"
        options={{
          title: t.help,
        }}
      />
      <Stack.Screen
        name="register-company"
        options={{
          title: t.registerYourCompany,
        }}
      />
      <Stack.Screen
        name="view-history"
        options={{
          title: t.viewHistory,
        }}
      />
    </Stack>
  );
}
