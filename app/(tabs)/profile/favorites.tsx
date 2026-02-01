import React, { useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Pressable,
  useColorScheme,
} from "react-native";
import { Star, TrendingDown, TrendingUp, Package } from "lucide-react-native";
import { router } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { mockCargoCompanies } from "@/mocks/cargo-data";
import { Colors } from "@/constants/colors";

const EXCHANGE_RATE = 11.25;

export default function FavoritesScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { t } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();

  const favoriteCompanies = useMemo(() => {
    return mockCargoCompanies.filter((company) => favorites.includes(company.id));
  }, [favorites]);

  const comparison = useMemo(() => {
    if (favoriteCompanies.length === 0) return null;

    const sorted = [...favoriteCompanies].sort((a, b) => a.pricePerKg - b.pricePerKg);
    const cheapest = sorted[0];
    const mostExpensive = sorted[sorted.length - 1];
    
    const fastestSorted = [...favoriteCompanies].sort((a, b) => a.avgDeliveryDays - b.avgDeliveryDays);
    const fastest = fastestSorted[0];
    const slowest = fastestSorted[fastestSorted.length - 1];

    const avgPrice = favoriteCompanies.reduce((sum, c) => sum + c.pricePerKg, 0) / favoriteCompanies.length;
    const avgDelivery = favoriteCompanies.reduce((sum, c) => sum + c.avgDeliveryDays, 0) / favoriteCompanies.length;

    return { cheapest, mostExpensive, fastest, slowest, avgPrice, avgDelivery };
  }, [favoriteCompanies]);

  if (favoriteCompanies.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.emptyState}>
          <Star color={theme.secondaryText} size={64} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            {t.noFavorites}
          </Text>
          <Text style={[styles.emptyDescription, { color: theme.secondaryText }]}>
            {t.noFavoritesHint}
          </Text>
          <TouchableOpacity
            style={[styles.browseButton, { backgroundColor: theme.primary }]}
            onPress={() => router.push("/(tabs)/(home)")}
          >
            <Text style={styles.browseButtonText}>{t.browseCompanies}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Comparison Banner */}
        {comparison && (
          <View style={[styles.comparisonBanner, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
            <Text style={[styles.comparisonTitle, { color: theme.text }]}>
              {t.quickComparison}
            </Text>
            <View style={styles.comparisonGrid}>
              <View style={[styles.comparisonCard, { backgroundColor: theme.tableHeader }]}>
                <TrendingDown color={theme.success} size={20} />
                <Text style={[styles.comparisonLabel, { color: theme.secondaryText }]}>
                  {t.cheapest}
                </Text>
                <Text style={[styles.comparisonValue, { color: theme.text }]}>
                  {comparison.cheapest.name}
                </Text>
                <Text style={[styles.comparisonPrice, { color: theme.success }]}>
                  ${comparison.cheapest.pricePerKg}/kg
                </Text>
              </View>

              <View style={[styles.comparisonCard, { backgroundColor: theme.tableHeader }]}>
                <TrendingUp color={theme.primary} size={20} />
                <Text style={[styles.comparisonLabel, { color: theme.secondaryText }]}>
                  {t.fastest}
                </Text>
                <Text style={[styles.comparisonValue, { color: theme.text }]}>
                  {comparison.fastest.name}
                </Text>
                <Text style={[styles.comparisonPrice, { color: theme.primary }]}>
                  {comparison.fastest.avgDeliveryDays}d
                </Text>
              </View>
            </View>

            <View style={[styles.averageRow, { backgroundColor: theme.primary + "10", borderColor: theme.primary }]}>
              <View style={styles.averageItem}>
                <Text style={[styles.averageLabel, { color: theme.secondaryText }]}>
                  {t.avgPrice}
                </Text>
                <Text style={[styles.averageValue, { color: theme.text }]}>
                  ${comparison.avgPrice.toFixed(2)}/kg
                </Text>
              </View>
              <View style={[styles.averageDivider, { backgroundColor: theme.border }]} />
              <View style={styles.averageItem}>
                <Text style={[styles.averageLabel, { color: theme.secondaryText }]}>
                  {t.avgDelivery}
                </Text>
                <Text style={[styles.averageValue, { color: theme.text }]}>
                  {comparison.avgDelivery.toFixed(1)} {t.days}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Favorites List */}
        <View style={styles.favoritesSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t.myFavorites} ({favoriteCompanies.length})
          </Text>

          {favoriteCompanies.map((company, index) => (
            <View key={company.id} style={styles.favoriteCardWrapper}>
              <Pressable
                style={[
                  styles.favoriteCard,
                  { backgroundColor: theme.cardBackground, borderColor: theme.border },
                ]}
                onPress={() => router.push(`/(tabs)/(home)/cargo/${company.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.logoContainer, { backgroundColor: theme.searchBackground }]}>
                    <Text style={styles.logo}>{company.logo}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.companyName, { color: theme.text }]} numberOfLines={1}>
                        {company.name}
                      </Text>
                      {company.isVerified && (
                        <View style={[styles.verifiedBadge, { backgroundColor: theme.verified }]}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.ratingRow}>
                      <Text style={[styles.rating, { color: theme.text }]}>⭐ {company.rating}</Text>
                      <Text style={[styles.reviewCount, { color: theme.secondaryText }]}>
                        ({company.reviewCount})
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.metricsRow, { backgroundColor: theme.tableHeader }]}>
                  <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>
                      {t.price}
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.primary }]}>
                      ${company.pricePerKg}/kg
                    </Text>
                    <Text style={[styles.metricSecondary, { color: theme.secondaryText }]}>
                      ≈ {(company.pricePerKg * EXCHANGE_RATE).toFixed(2)} TJS
                    </Text>
                  </View>
                  <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>
                      {t.delivery}
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.primary }]}>
                      {company.avgDeliveryDays}d
                    </Text>
                  </View>
                  <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.metric}>
                    <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>
                      {t.reliability}
                    </Text>
                    <Text style={[styles.metricValue, { color: theme.success }]}>
                      {company.reliabilityScore}%
                    </Text>
                  </View>
                </View>

                {index === 0 && comparison && company.id === comparison.cheapest.id && (
                  <View style={[styles.bestBadge, { backgroundColor: theme.success }]}>
                    <Text style={styles.bestBadgeText}>{t.bestPrice}</Text>
                  </View>
                )}
              </Pressable>

              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: theme.warning }]}
                onPress={() => toggleFavorite(company.id)}
              >
                <Star color="#ffffff" size={20} fill="#ffffff" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  browseButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  comparisonBanner: {
    padding: 16,
    borderBottomWidth: 1,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  comparisonGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  comparisonCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 6,
  },
  comparisonLabel: {
    fontSize: 12,
  },
  comparisonValue: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  comparisonPrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  averageRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    gap: 12,
  },
  averageItem: {
    flex: 1,
    alignItems: "center",
  },
  averageLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  averageValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  averageDivider: {
    width: 2,
  },
  favoritesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  favoriteCardWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  favoriteCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  verifiedBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: {
    fontSize: 12,
    color: "#ffffff",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 15,
    fontWeight: "600",
  },
  reviewCount: {
    fontSize: 14,
  },
  metricsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 2,
  },
  metricSecondary: {
    fontSize: 11,
  },
  metricDivider: {
    width: 2,
  },
  removeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  bestBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  bestBadgeText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
