import { Stack } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AuthLayout() {
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
        name="login"
        options={{
          title: t.signIn,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="register"
        options={{
          title: t.signUp,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
