import { router } from "expo-router";
import { TrendingUp, Search, ArrowUp, ArrowDown, Minus, Star } from "lucide-react-native";
import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Pressable,
  useColorScheme,
  RefreshControl,
} from "react-native";

import { cargoCompanies, type TransportType } from "@/mocks/cargo-data";
import { Colors } from "@/constants/colors";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { SkeletonCompanyCard, SkeletonTableRow } from "@/components/Skeleton";

// Financial Dashboard Exchange Rate
const EXCHANGE_RATE = 11.25;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [currency, setCurrency] = useState<'USD' | 'TJS'>('USD');
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<TransportType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const filteredCompanies = useMemo(() => {
    let filtered = cargoCompanies;

    if (searchQuery.trim()) {
      filtered = filtered.filter((company) =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((company) =>
        company.transportTypes.some((type) => selectedFilters.includes(type))
      );
    }

    return filtered;
  }, [searchQuery, selectedFilters]);

  const rankedCompanies = useMemo(
    () => [...cargoCompanies].sort((a, b) => b.rating - a.rating).map((company, index) => ({ ...company, rank: index + 1 })),
    []
  );

  const trendingCompanies = useMemo(
    () => rankedCompanies.slice(0, 3),
    [rankedCompanies]
  );

  const convertPrice = (usdPrice: number): { primary: string; secondary: string } => {
    const usd = `$${usdPrice.toFixed(2)}`;
    const tjs = `≈ ${(usdPrice * EXCHANGE_RATE).toFixed(2)} TJS`;
    
    if (currency === 'USD') {
      return { primary: usd, secondary: tjs };
    }
    return { primary: `${(usdPrice * EXCHANGE_RATE).toFixed(2)} TJS`, secondary: usd };
  };

  const getPriceChange = (): 'stable' | 'up' | 'down' => {
    return 'stable';
  };

  const toggleFilter = (filter: TransportType) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  const getTransportTypeLabel = (type: TransportType): string => {
    const labels: Record<TransportType, string> = {
      air: "Air",
      auto: "Auto",
      rail: "Rail",
    };
    return labels[type];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBackground }]}>
      <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={[styles.searchContainer, { backgroundColor: theme.searchBackground }]}>
          <Search color={theme.secondaryText} size={20} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t.search}
            placeholderTextColor={theme.secondaryText}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.filterContainer}>
          {(["air", "auto", "rail"] as TransportType[]).map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterChip,
                { backgroundColor: theme.searchBackground, borderColor: theme.border },
                selectedFilters.includes(filter) && { backgroundColor: theme.primary, borderColor: theme.primary },
              ]}
              onPress={() => toggleFilter(filter)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  { color: theme.secondaryText },
                  selectedFilters.includes(filter) && styles.filterChipTextActive,
                ]}
              >
                {getTransportTypeLabel(filter)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        <View style={[styles.currencyBar, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
          <Text style={[styles.currencyLabel, { color: theme.secondaryText }]}>{t.currency}:</Text>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              { borderColor: theme.border },
              currency === 'USD' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setCurrency('USD')}
          >
            <Text style={[styles.currencyText, { color: currency === 'USD' ? '#ffffff' : theme.text }]}>USD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.currencyButton,
              { borderColor: theme.border },
              currency === 'TJS' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setCurrency('TJS')}
          >
            <Text style={[styles.currencyText, { color: currency === 'TJS' ? '#ffffff' : theme.text }]}>TJS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp color={theme.primary} size={20} />
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.trending}</Text>
          </View>
          {isLoading ? (
            <>
              <SkeletonCompanyCard />
              <SkeletonCompanyCard />
            </>
          ) : (
            trendingCompanies.map((company) => (
            <View key={company.id} style={styles.trendingCardWrapper}>
              <Pressable
                style={[styles.trendingCard, { backgroundColor: theme.cardBackground, borderColor: theme.primary }]}
                onPress={() => router.push(`/(tabs)/(home)/cargo/${company.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.logoContainer, { backgroundColor: theme.searchBackground }]}>
                    <Text style={styles.logo}>{company.logo}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <View style={styles.nameRow}>
                      <Text style={[styles.companyName, { color: theme.text }]}>{company.name}</Text>
                      {company.isVerified && (
                        <Text style={[styles.verifiedBadge, { backgroundColor: theme.verified }]}>✓</Text>
                      )}
                    </View>
                    <View style={styles.ratingRow}>
                      <Text style={[styles.rating, { color: theme.text }]}>⭐ {company.rating}</Text>
                      <Text style={[styles.reviewCount, { color: theme.secondaryText }]}>({company.reviewCount} {t.reviews.toLowerCase()})</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.metricsRow, { backgroundColor: theme.tableHeader }]}>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: theme.primary }]} numberOfLines={1} adjustsFontSizeToFit>
                      {convertPrice(company.pricePerKg).primary}
                    </Text>
                    <Text style={[styles.metricSecondary, { color: theme.secondaryText }]} numberOfLines={1} adjustsFontSizeToFit>
                      {convertPrice(company.pricePerKg).secondary}
                    </Text>
                    <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>{t.price}</Text>
                  </View>
                  <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: theme.primary }]}>{company.avgDeliveryDays}d</Text>
                    <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>{t.delivery}</Text>
                  </View>
                  <View style={[styles.metricDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: theme.primary }]}>{company.reliabilityScore}%</Text>
                    <Text style={[styles.metricLabel, { color: theme.secondaryText }]}>{t.reliability}</Text>
                  </View>
                </View>
              </Pressable>
              <TouchableOpacity
                style={[styles.favoriteButton, { backgroundColor: isFavorite(company.id) ? theme.warning : theme.background }]}
                onPress={() => toggleFavorite(company.id)}
              >
                <Star
                  color={isFavorite(company.id) ? "#ffffff" : theme.secondaryText}
                  size={20}
                  fill={isFavorite(company.id) ? "#ffffff" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{t.allCompanies} ({filteredCompanies.length})</Text>
          
          <View style={[styles.tableHeader, { backgroundColor: theme.tableHeader, borderBottomColor: theme.tableBorder }]}>
            <Text style={[styles.tableHeaderText, { color: theme.secondaryText }, styles.rankColumn]} numberOfLines={1} adjustsFontSizeToFit>
              #
            </Text>
            <Text style={[styles.tableHeaderText, { color: theme.secondaryText }, styles.companyColumn]} numberOfLines={1} adjustsFontSizeToFit>
              {t.cargo}
            </Text>
            <Text style={[styles.tableHeaderText, { color: theme.secondaryText }, styles.priceColumn]} numberOfLines={1} adjustsFontSizeToFit>
              {t.price}
            </Text>
            <Text style={[styles.tableHeaderText, { color: theme.secondaryText }, styles.deliveryColumn]} numberOfLines={1} adjustsFontSizeToFit>
              {t.delivery}
            </Text>
          </View>

          {isLoading ? (
            <>
              <SkeletonTableRow />
              <SkeletonTableRow />
              <SkeletonTableRow />
              <SkeletonTableRow />
              <SkeletonTableRow />
            </>
          ) : (
            filteredCompanies.map((company, index) => {
            const priceChange = getPriceChange();
            const prices = convertPrice(company.pricePerKg);
            return (
              <Pressable
                key={company.id}
                style={[styles.tableRow, { backgroundColor: theme.cardBackground, borderBottomColor: theme.tableBorder }]}
                onPress={() => router.push(`/(tabs)/(home)/cargo/${company.id}`)}
              >
                <View style={styles.rankCell}>
                  <Text style={[styles.rankText, { color: theme.secondaryText }]} numberOfLines={1} adjustsFontSizeToFit>
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.companyCell}>
                  <View style={[styles.logoTable, { backgroundColor: theme.searchBackground }]}>
                    <Text style={styles.logoTableText}>{company.logo}</Text>
                  </View>
                  <View style={styles.companyInfoTable}>
                    <View style={styles.nameRowTable}>
                      <Text style={[styles.companyNameTable, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>
                        {company.name}
                      </Text>
                      {company.isVerified && (
                        <Text style={[styles.verifiedBadgeTable, { backgroundColor: theme.verified }]}>✓</Text>
                      )}
                    </View>
                    <Text style={[styles.ratingTable, { color: theme.secondaryText }]} numberOfLines={1}>
                      ⭐ {company.rating} · {company.totalShipments.toLocaleString()}
                    </Text>
                  </View>
                </View>
                <View style={styles.priceCell}>
                  <Text style={[styles.priceCellText, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>
                    {prices.primary}
                  </Text>
                  <Text style={[styles.priceCellSecondary, { color: theme.secondaryText }]} numberOfLines={1} adjustsFontSizeToFit>
                    {prices.secondary}
                  </Text>
                  {priceChange === 'stable' && (
                    <View style={styles.priceChangeRow}>
                      <Minus size={10} color={theme.secondaryText} />
                      <Text style={[styles.priceChangeText, { color: theme.secondaryText }]}>{t.stable}</Text>
                    </View>
                  )}
                  {priceChange === 'up' && (
                    <View style={styles.priceChangeRow}>
                      <ArrowUp size={10} color={theme.positive} />
                      <Text style={[styles.priceChangeText, { color: theme.positive }]}>2%</Text>
                    </View>
                  )}
                  {priceChange === 'down' && (
                    <View style={styles.priceChangeRow}>
                      <ArrowDown size={10} color={theme.negative} />
                      <Text style={[styles.priceChangeText, { color: theme.negative }]}>2%</Text>
                    </View>
                  )}
                </View>
                <View style={styles.deliveryCell}>
                  <Text style={[styles.deliveryCellText, { color: theme.primary }]} numberOfLines={1} adjustsFontSizeToFit>
                    {company.avgDeliveryDays}d
                  </Text>
                </View>
              </Pressable>
            );
          })
          )}
        </View>

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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  filterChipTextActive: {
    color: "#ffffff",
  },
  currencyBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  currencyLabel: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  currencyButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  currencyText: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 16,
  },
  trendingCardWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  trendingCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
  },
  cardHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  logo: {
    fontSize: 28,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  companyName: {
    fontSize: 18,
    fontWeight: "700" as const,
  },
  verifiedBadge: {
    fontSize: 14,
    color: "#ffffff",
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: "center",
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  reviewCount: {
    fontSize: 13,
  },
  metricsRow: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
  },
  metric: {
    flex: 1,
    alignItems: "center",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 2,
  },
  metricSecondary: {
    fontSize: 10,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
  },
  metricDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    marginBottom: 0,
    borderRadius: 8,
    alignItems: "center",
  },
  tableHeaderText: {
    fontSize: 11,
    fontWeight: "700" as const,
    textTransform: "uppercase" as const,
  },
  rankColumn: {
    flex: 0.5,
    textAlign: "center",
  },
  companyColumn: {
    flex: 2.5,
  },
  priceColumn: {
    flex: 1.5,
    textAlign: "right",
  },
  deliveryColumn: {
    flex: 1.5,
    textAlign: "center",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  rankCell: {
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  rankText: {
    fontSize: 13,
    fontWeight: "600" as const,
  },
  companyCell: {
    flex: 2.5,
    flexDirection: "row",
    alignItems: "center",
  },
  logoTable: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  logoTableText: {
    fontSize: 18,
  },
  companyInfoTable: {
    flex: 1,
  },
  nameRowTable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 2,
  },
  companyNameTable: {
    fontSize: 15,
    fontWeight: "600" as const,
    flex: 1,
  },
  verifiedBadgeTable: {
    fontSize: 10,
    color: "#ffffff",
    width: 14,
    height: 14,
    borderRadius: 7,
    textAlign: "center",
    lineHeight: 14,
  },
  ratingTable: {
    fontSize: 12,
  },
  priceCell: {
    flex: 1.5,
    alignItems: "flex-end",
    paddingRight: 8,
  },
  priceCellText: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  priceCellSecondary: {
    fontSize: 9,
    marginTop: 1,
  },
  priceChangeText: {
    fontSize: 10,
    fontWeight: "600" as const,
  },
  priceChangeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginTop: 2,
  },
  deliveryCell: {
    flex: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryCellText: {
    fontSize: 13,
    fontWeight: "700" as const,
  },
  bottomPadding: {
    height: 20,
  },
});
