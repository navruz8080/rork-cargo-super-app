import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Calculator, Package, Plane, Truck, Train, TrendingDown, TrendingUp } from "lucide-react-native";
import { router } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockCargoCompanies, PriceRate } from "@/mocks/cargo-data";
import { Colors } from "@/constants/colors";

const EXCHANGE_RATE = 11.25;

type TransportType = 'air' | 'auto' | 'rail' | 'all';
type CategoryType = 'electronics' | 'clothing' | 'home_goods' | 'food' | 'all';

export default function CalculatorScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { t } = useLanguage();

  const [weight, setWeight] = useState<string>("");
  const [selectedTransport, setSelectedTransport] = useState<TransportType>("all");
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("all");

  const transportOptions: { value: TransportType; label: string; icon: any }[] = [
    { value: "all", label: t.allTypes, icon: Package },
    { value: "air", label: t.air, icon: Plane },
    { value: "auto", label: t.auto, icon: Truck },
    { value: "rail", label: t.rail, icon: Train },
  ];

  const categoryOptions: { value: CategoryType; label: string; multiplier: number }[] = [
    { value: "all", label: t.allCategories, multiplier: 1 },
    { value: "electronics", label: t.electronics, multiplier: 1.2 },
    { value: "clothing", label: t.clothing, multiplier: 0.9 },
    { value: "home_goods", label: t.homeGoods, multiplier: 1.0 },
    { value: "food", label: t.food, multiplier: 1.1 },
  ];

  const calculatedResults = useMemo(() => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) return [];

    const categoryMultiplier = categoryOptions.find(c => c.value === selectedCategory)?.multiplier || 1;

    return mockCargoCompanies
      .filter(company => {
        if (selectedTransport === "all") return true;
        return company.transportTypes.includes(selectedTransport);
      })
      .map(company => {
        const basePriceUSD = company.pricePerKg * weightNum * categoryMultiplier;
        const priceTJS = basePriceUSD * EXCHANGE_RATE;
        
        return {
          id: company.id,
          name: company.name,
          logo: company.logo,
          priceUSD: basePriceUSD,
          priceTJS: priceTJS,
          pricePerKg: company.pricePerKg,
          deliveryDays: company.avgDeliveryDays,
          rating: company.rating,
          isVerified: company.isVerified,
        };
      })
      .sort((a, b) => a.priceUSD - b.priceUSD);
  }, [weight, selectedTransport, selectedCategory]);

  const cheapest = calculatedResults[0];
  const fastest = calculatedResults.sort((a, b) => a.deliveryDays - b.deliveryDays)[0];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
          <View style={styles.headerIcon}>
            <Calculator color={theme.primary} size={28} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              {t.deliveryCalculator}
            </Text>
            <Text style={[styles.headerSubtitle, { color: theme.secondaryText }]}>
              {t.calculateShippingCost}
            </Text>
          </View>
        </View>

        {/* Weight Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            {t.weight} (kg)
          </Text>
          <View style={[styles.weightInputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Package color={theme.primary} size={20} />
            <TextInput
              style={[styles.weightInput, { color: theme.text }]}
              placeholder={t.enterWeight}
              placeholderTextColor={theme.secondaryText}
              keyboardType="decimal-pad"
              value={weight}
              onChangeText={setWeight}
            />
            <Text style={[styles.weightUnit, { color: theme.secondaryText }]}>kg</Text>
          </View>
        </View>

        {/* Transport Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            {t.transportType}
          </Text>
          <View style={styles.transportGrid}>
            {transportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedTransport === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.transportOption,
                    { backgroundColor: theme.cardBackground, borderColor: theme.border },
                    isSelected && { borderColor: theme.primary, backgroundColor: `${theme.primary}15` },
                  ]}
                  onPress={() => setSelectedTransport(option.value)}
                >
                  <Icon color={isSelected ? theme.primary : theme.secondaryText} size={24} />
                  <Text
                    style={[
                      styles.transportOptionText,
                      { color: theme.secondaryText },
                      isSelected && { color: theme.primary, fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.text }]}>
            {t.cargoCategory}
          </Text>
          <View style={styles.categoryList}>
            {categoryOptions.map((option) => {
              const isSelected = selectedCategory === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.categoryOption,
                    { backgroundColor: theme.cardBackground, borderColor: theme.border },
                    isSelected && { borderColor: theme.primary, backgroundColor: `${theme.primary}10` },
                  ]}
                  onPress={() => setSelectedCategory(option.value)}
                >
                  <View style={styles.categoryOptionContent}>
                    <Text
                      style={[
                        styles.categoryOptionText,
                        { color: theme.text },
                        isSelected && { color: theme.primary, fontWeight: "700" },
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.multiplier !== 1 && (
                      <View style={[styles.multiplierBadge, { backgroundColor: theme.warning + "20" }]}>
                        <Text style={[styles.multiplierText, { color: theme.warning }]}>
                          ×{option.multiplier}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isSelected && (
                    <View style={[styles.selectedIndicator, { backgroundColor: theme.primary }]} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Results */}
        {calculatedResults.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionLabel, { color: theme.text }]}>
              {t.calculationResults} ({calculatedResults.length})
            </Text>

            {/* Best Options Banner */}
            {cheapest && fastest && (
              <View style={[styles.bestOptionsBanner, { backgroundColor: theme.primary + "10", borderColor: theme.primary }]}>
                <View style={styles.bestOption}>
                  <TrendingDown color={theme.success} size={20} />
                  <View style={styles.bestOptionInfo}>
                    <Text style={[styles.bestOptionLabel, { color: theme.secondaryText }]}>
                      {t.cheapest}
                    </Text>
                    <Text style={[styles.bestOptionValue, { color: theme.text }]}>
                      {cheapest.name}
                    </Text>
                    <Text style={[styles.bestOptionPrice, { color: theme.success }]}>
                      ${cheapest.priceUSD.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <View style={[styles.bestOptionDivider, { backgroundColor: theme.border }]} />
                <View style={styles.bestOption}>
                  <TrendingUp color={theme.primary} size={20} />
                  <View style={styles.bestOptionInfo}>
                    <Text style={[styles.bestOptionLabel, { color: theme.secondaryText }]}>
                      {t.fastest}
                    </Text>
                    <Text style={[styles.bestOptionValue, { color: theme.text }]}>
                      {fastest.name}
                    </Text>
                    <Text style={[styles.bestOptionPrice, { color: theme.primary }]}>
                      {fastest.deliveryDays}d
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Results List */}
            {calculatedResults.map((result, index) => (
              <TouchableOpacity
                key={result.id}
                style={[
                  styles.resultCard,
                  { backgroundColor: theme.cardBackground, borderColor: theme.border },
                  index === 0 && { borderColor: theme.success, borderWidth: 2 },
                ]}
                onPress={() => router.push(`/(tabs)/(home)/cargo/${result.id}`)}
              >
                <View style={styles.resultHeader}>
                  <View style={styles.resultRank}>
                    <Text style={[styles.resultRankText, { color: index === 0 ? theme.success : theme.secondaryText }]}>
                      #{index + 1}
                    </Text>
                  </View>
                  <View style={[styles.resultLogo, { backgroundColor: theme.searchBackground }]}>
                    <Text style={styles.resultLogoText}>{result.logo}</Text>
                  </View>
                  <View style={styles.resultInfo}>
                    <View style={styles.resultNameRow}>
                      <Text style={[styles.resultName, { color: theme.text }]} numberOfLines={1}>
                        {result.name}
                      </Text>
                      {result.isVerified && (
                        <View style={[styles.verifiedBadge, { backgroundColor: theme.verified }]}>
                          <Text style={styles.verifiedText}>✓</Text>
                        </View>
                      )}
                    </View>
                    <View style={styles.resultMetaRow}>
                      <Text style={[styles.resultRating, { color: theme.text }]}>
                        ⭐ {result.rating}
                      </Text>
                      <Text style={[styles.resultDelivery, { color: theme.secondaryText }]}>
                        • {result.deliveryDays}d
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.resultPriceContainer, { backgroundColor: theme.tableHeader }]}>
                  <View style={styles.resultPriceColumn}>
                    <Text style={[styles.resultPriceLabel, { color: theme.secondaryText }]}>
                      {t.totalPrice}
                    </Text>
                    <Text style={[styles.resultPriceValue, { color: theme.primary }]}>
                      ${result.priceUSD.toFixed(2)}
                    </Text>
                    <Text style={[styles.resultPriceAlt, { color: theme.secondaryText }]}>
                      ≈ {result.priceTJS.toFixed(2)} TJS
                    </Text>
                  </View>
                  <View style={[styles.resultPriceDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.resultPriceColumn}>
                    <Text style={[styles.resultPriceLabel, { color: theme.secondaryText }]}>
                      {t.perKg}
                    </Text>
                    <Text style={[styles.resultPriceValue, { color: theme.text }]}>
                      ${result.pricePerKg.toFixed(2)}
                    </Text>
                    <Text style={[styles.resultPriceAlt, { color: theme.secondaryText }]}>
                      ≈ {(result.pricePerKg * EXCHANGE_RATE).toFixed(2)} TJS
                    </Text>
                  </View>
                </View>

                {index === 0 && (
                  <View style={[styles.bestChoiceBadge, { backgroundColor: theme.success }]}>
                    <Text style={styles.bestChoiceText}>{t.bestPrice}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Empty State */}
        {(!weight || parseFloat(weight) <= 0) && (
          <View style={styles.emptyState}>
            <Calculator color={theme.secondaryText} size={64} />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
              {t.enterWeightToCalculate}
            </Text>
            <Text style={[styles.emptyStateDescription, { color: theme.secondaryText }]}>
              {t.calculatorHint}
            </Text>
          </View>
        )}
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
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  section: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  weightInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    gap: 12,
  },
  weightInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
  },
  weightUnit: {
    fontSize: 16,
    fontWeight: "600",
  },
  transportGrid: {
    flexDirection: "row",
    gap: 8,
  },
  transportOption: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 8,
    minHeight: 80,
    justifyContent: "center",
  },
  transportOptionText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  categoryList: {
    gap: 8,
  },
  categoryOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  categoryOptionText: {
    fontSize: 15,
    fontWeight: "600",
  },
  multiplierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  multiplierText: {
    fontSize: 12,
    fontWeight: "700",
  },
  selectedIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bestOptionsBanner: {
    borderWidth: 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    gap: 16,
  },
  bestOption: {
    flex: 1,
    gap: 8,
    alignItems: "center",
  },
  bestOptionInfo: {
    alignItems: "center",
  },
  bestOptionLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  bestOptionValue: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
    textAlign: "center",
  },
  bestOptionPrice: {
    fontSize: 16,
    fontWeight: "800",
  },
  bestOptionDivider: {
    width: 2,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  resultRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  resultRankText: {
    fontSize: 14,
    fontWeight: "800",
  },
  resultLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  resultLogoText: {
    fontSize: 24,
  },
  resultInfo: {
    flex: 1,
  },
  resultNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  resultName: {
    fontSize: 16,
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
  resultMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  resultRating: {
    fontSize: 14,
    fontWeight: "600",
  },
  resultDelivery: {
    fontSize: 14,
  },
  resultPriceContainer: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  resultPriceColumn: {
    flex: 1,
    alignItems: "center",
  },
  resultPriceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  resultPriceValue: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 2,
  },
  resultPriceAlt: {
    fontSize: 11,
  },
  resultPriceDivider: {
    width: 2,
  },
  bestChoiceBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  bestChoiceText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
