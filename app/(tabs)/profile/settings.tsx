import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
} from "react-native";
import { router } from "expo-router";
import {
  Bell,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Trash2,
  Info,
  Shield,
  Download,
  RefreshCw,
} from "lucide-react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { useViewHistory } from "@/contexts/ViewHistoryContext";
import { Colors } from "@/constants/colors";
import { Language } from "@/constants/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { language, setLanguage, t } = useLanguage();
  const { clearHistory } = useViewHistory();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoTheme, setAutoTheme] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  ];

  const handleClearCache = () => {
    Alert.alert(
      t.clearCache,
      t.clearCacheConfirm,
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.clear,
          style: "destructive",
          onPress: async () => {
            try {
              // Clear AsyncStorage except for user data and favorites
              const keys = await AsyncStorage.getAllKeys();
              const keysToKeep = ['user', 'favorites', 'view_history', 'language'];
              const keysToRemove = keys.filter(key => !keysToKeep.includes(key));
              await AsyncStorage.multiRemove(keysToRemove);
              Alert.alert(t.success, t.cacheCleared);
            } catch (e) {
              Alert.alert(t.error, t.cacheClearFailed);
            }
          },
        },
      ]
    );
  };

  const handleClearViewHistory = () => {
    Alert.alert(
      t.clearHistory,
      t.clearHistoryConfirm,
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.clear,
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            Alert.alert(t.success, t.historyCleared);
          },
        },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      t.clearAllData,
      t.clearAllDataConfirm,
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.clear,
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear();
              Alert.alert(t.success, t.allDataCleared);
              router.replace('/(auth)/login');
            } catch (e) {
              Alert.alert(t.error, t.clearDataFailed);
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.notifications}</Text>
        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Bell color={theme.primary} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.pushNotifications}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.pushNotificationsDesc}
              </Text>
            </View>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#ffffff"
          />
        </View>
      </View>

      {/* Appearance Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.appearance}</Text>
        
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={() => {
            // Language selection modal would go here
            Alert.alert(t.language, t.selectLanguage);
          }}
        >
          <View style={styles.settingLeft}>
            <Globe color={theme.primary} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.language}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {languages.find(l => l.code === language)?.nativeName || language}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>→</Text>
        </TouchableOpacity>

        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.settingLeft}>
            {colorScheme === 'dark' ? (
              <Moon color={theme.primary} size={20} />
            ) : (
              <Sun color={theme.primary} size={20} />
            )}
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.theme}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.themeDescription}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>
            {colorScheme === 'dark' ? t.dark : t.light}
          </Text>
        </View>
      </View>

      {/* Data & Storage Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.dataAndStorage}</Text>
        
        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={handleClearCache}
        >
          <View style={styles.settingLeft}>
            <RefreshCw color={theme.warning} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.clearCache}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.clearCacheDesc}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={handleClearViewHistory}
        >
          <View style={styles.settingLeft}>
            <Trash2 color={theme.danger} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.clearViewHistory}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.clearViewHistoryDesc}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
          onPress={handleClearAllData}
        >
          <View style={styles.settingLeft}>
            <Trash2 color={theme.danger} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.clearAllData}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.clearAllDataDesc}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>→</Text>
        </TouchableOpacity>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.about}</Text>
        
        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Info color={theme.primary} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.appVersion}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                1.0.0
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Shield color={theme.primary} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.privacyPolicy}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.privacyPolicyDesc}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>→</Text>
        </View>

        <View style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.settingLeft}>
            <Info color={theme.primary} size={20} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.text }]}>{t.termsOfService}</Text>
              <Text style={[styles.settingDescription, { color: theme.secondaryText }]}>
                {t.termsOfServiceDesc}
              </Text>
            </View>
          </View>
          <Text style={[styles.settingValue, { color: theme.secondaryText }]}>→</Text>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
  settingValue: {
    fontSize: 16,
    marginLeft: 8,
  },
  bottomPadding: {
    height: 40,
  },
});
