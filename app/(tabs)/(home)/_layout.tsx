import { Stack } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomeLayout() {
  const { language } = useLanguage();
  
  const getHomeTitle = () => {
    if (language === 'en') return 'Drop Logistics';
    if (language === 'ru') return 'Drop Logistics';
    return 'Drop Logistics';
  };

  const getCargoDetailsTitle = () => {
    if (language === 'en') return 'Cargo Details';
    if (language === 'ru') return 'Детали';
    return 'Тафсилот';
  };

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
          title: getHomeTitle(),
        }}
      />
      <Stack.Screen
        name="cargo/[id]"
        options={{
          title: getCargoDetailsTitle(),
        }}
      />
    </Stack>
  );
}
