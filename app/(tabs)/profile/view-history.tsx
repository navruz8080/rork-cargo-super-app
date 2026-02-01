import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { Clock, Trash2, Package } from "lucide-react-native";
import { useLanguage } from "@/contexts/LanguageContext";
import { useViewHistory } from "@/contexts/ViewHistoryContext";
import { Colors } from "@/constants/colors";

export default function ViewHistoryScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { t } = useLanguage();
  const { history, clearHistory, removeFromHistory } = useViewHistory();

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t.justNow;
    if (minutes < 60) return `${minutes} ${t.minutesAgo}`;
    if (hours < 24) return `${hours} ${t.hoursAgo}`;
    if (days < 7) return `${days} ${t.daysAgo}`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleClearAll = () => {
    Alert.alert(
      t.clearHistory,
      t.clearHistoryConfirm,
      [
        { text: t.cancel, style: "cancel" },
        {
          text: t.clear,
          style: "destructive",
          onPress: () => clearHistory(),
        },
      ]
    );
  };

  const handleRemove = (companyId: string) => {
    removeFromHistory(companyId);
  };

  if (history.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyContainer}>
          <Clock color={theme.secondaryText} size={64} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>{t.noViewHistory}</Text>
          <Text style={[styles.emptySubtitle, { color: theme.secondaryText }]}>
            {t.noViewHistoryDesc}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t.viewHistory}</Text>
        <TouchableOpacity
          style={[styles.clearButton, { backgroundColor: theme.searchBackground }]}
          onPress={handleClearAll}
        >
          <Trash2 color={theme.danger} size={18} />
          <Text style={[styles.clearButtonText, { color: theme.danger }]}>{t.clearAll}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {history.map((item) => (
          <Pressable
            key={item.companyId}
            style={[styles.historyItem, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
            onPress={() => router.push(`/(tabs)/(home)/cargo/${item.companyId}`)}
          >
            <View style={[styles.logoContainer, { backgroundColor: theme.searchBackground }]}>
              <Text style={styles.logoText}>{item.companyLogo}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={[styles.companyName, { color: theme.text }]} numberOfLines={1}>
                {item.companyName}
              </Text>
              <View style={styles.timeRow}>
                <Clock color={theme.secondaryText} size={14} />
                <Text style={[styles.timeText, { color: theme.secondaryText }]}>
                  {formatTimeAgo(item.viewedAt)}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemove(item.companyId)}
            >
              <Trash2 color={theme.secondaryText} size={18} />
            </TouchableOpacity>
          </Pressable>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  content: {
    flex: 1,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  logoText: {
    fontSize: 24,
  },
  itemInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  timeText: {
    fontSize: 13,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});
