import { useLocalSearchParams } from "expo-router";
import {
  MapPin,
  Phone,
  Clock,
  Copy,
  Star,
  Package,
  CheckCircle,
  MessageCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  useColorScheme,
} from "react-native";
import * as Clipboard from "expo-clipboard";

import {
  cargoCompanies,
  warehouses,
  priceRates,
  reviews,
  type TransportType,
} from "@/mocks/cargo-data";
import { Colors } from "@/constants/colors";
import { EXCHANGE_RATE_USD_TO_TJS } from "@/constants/translations";
import { useLanguage } from "@/contexts/LanguageContext";

type Tab = "rates" | "warehouses" | "reviews" | "tracking";

export default function CargoDetailScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const { t } = useLanguage();
  const [currency, setCurrency] = useState<'USD' | 'TJS'>('USD');
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("rates");

  const cargo = cargoCompanies.find((c) => c.id === id);
  const cargoWarehouses = warehouses.filter((w) => w.cargoId === id);
  const cargoRates = priceRates.filter((r) => r.cargoId === id);
  const cargoReviews = reviews.filter((r) => r.cargoId === id);

  if (!cargo) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.secondaryBackground }]}>
        <Text style={[styles.errorText, { color: theme.secondaryText }]}>Cargo company not found</Text>
      </View>
    );
  }

  const convertPrice = (usdPrice: number): string => {
    if (currency === 'USD') {
      return `$${usdPrice.toFixed(2)}`;
    }
    return `${(usdPrice * EXCHANGE_RATE_USD_TO_TJS).toFixed(0)} TJS`;
  };

  const copyToClipboard = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert(t.copyAddress, `${label}: ${text}`);
  };

  const openWhatsApp = () => {
    const phoneNumber = "+992000000000";
    const message = `Hello, I'm interested in ${cargo.name}`;
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("Error", "WhatsApp is not installed");
    });
  };

  const getTransportTypeLabel = (type: TransportType): string => {
    const labels: Record<TransportType, string> = {
      air: "Air ✈️",
      auto: "Auto 🚛",
      rail: "Rail 🚂",
    };
    return labels[type];
  };

  const mockPriceHistory = [
    { day: 1, price: 3.2 },
    { day: 7, price: 3.4 },
    { day: 14, price: 3.3 },
    { day: 21, price: 3.5 },
    { day: 30, price: cargo.pricePerKg },
  ];

  const renderPriceChart = () => {
    const maxPrice = Math.max(...mockPriceHistory.map(p => p.price));
    const minPrice = Math.min(...mockPriceHistory.map(p => p.price));
    const range = maxPrice - minPrice || 1;

    return (
      <View style={[styles.chartContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Text style={[styles.chartTitle, { color: theme.text }]}>{t.priceHistory}</Text>
        <View style={styles.chartArea}>
          {mockPriceHistory.map((point, index) => {
            const height = ((point.price - minPrice) / range) * 80 + 20;
            const isLast = index === mockPriceHistory.length - 1;
            return (
              <View key={point.day} style={styles.chartBar}>
                <View style={[styles.chartValue, { height, backgroundColor: isLast ? theme.primary : theme.border }]} />
                <Text style={[styles.chartLabel, { color: theme.secondaryText }]}>{point.day}d</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderRatesTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabDescription, { color: theme.secondaryText }]}>
        Price per kg based on cargo category and transport type
      </Text>
      {renderPriceChart()}
      {cargoRates.map((rate) => (
        <View key={rate.id} style={[styles.rateCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.rateHeader}>
            <Text style={[styles.rateCategory, { color: theme.text }]}>{rate.category}</Text>
            <View>
              <Text style={[styles.ratePrice, { color: theme.primary }]}>{convertPrice(rate.pricePerKg)}/kg</Text>
              {currency === 'USD' && (
                <Text style={[styles.ratePriceAlt, { color: theme.secondaryText }]}>
                  {(rate.pricePerKg * EXCHANGE_RATE_USD_TO_TJS).toFixed(0)} TJS
                </Text>
              )}
              {currency === 'TJS' && (
                <Text style={[styles.ratePriceAlt, { color: theme.secondaryText }]}>
                  ${rate.pricePerKg.toFixed(2)}
                </Text>
              )}
            </View>
          </View>
          <View style={styles.rateDetails}>
            <View style={styles.rateDetailRow}>
              <Text style={[styles.rateDetailLabel, { color: theme.secondaryText }]}>Transport:</Text>
              <Text style={[styles.rateDetailValue, { color: theme.text }]}>
                {getTransportTypeLabel(rate.transportType)}
              </Text>
            </View>
            <View style={styles.rateDetailRow}>
              <Text style={[styles.rateDetailLabel, { color: theme.secondaryText }]}>Estimated:</Text>
              <Text style={[styles.rateDetailValue, { color: theme.text }]}>{rate.estimatedDays}</Text>
            </View>
            {rate.minWeight && (
              <View style={styles.rateDetailRow}>
                <Text style={[styles.rateDetailLabel, { color: theme.secondaryText }]}>Min weight:</Text>
                <Text style={[styles.rateDetailValue, { color: theme.text }]}>
                  {rate.minWeight} kg
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
      {cargoRates.length === 0 && (
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No rates available</Text>
      )}
    </View>
  );

  const renderWarehousesTab = () => (
    <View style={styles.tabContent}>
      <Text style={[styles.tabDescription, { color: theme.secondaryText }]}>
        {t.sendTo}
      </Text>
      {cargoWarehouses.map((warehouse) => (
        <View key={warehouse.id} style={[styles.warehouseCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.warehouseHeader}>
            <MapPin color={theme.primary} size={20} />
            <Text style={[styles.warehouseName, { color: theme.text }]}>{warehouse.name}</Text>
          </View>
          <View style={styles.warehouseInfo}>
            <Text style={[styles.warehouseCity, { color: theme.primary }]}>{warehouse.city}</Text>
            <View style={styles.addressRow}>
              <Text style={[styles.addressText, { color: theme.secondaryText }]}>{warehouse.address}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(warehouse.address, "Warehouse address")}
                style={[styles.copyButton, { backgroundColor: theme.searchBackground }]}
              >
                <Copy color={theme.primary} size={18} />
              </TouchableOpacity>
            </View>
            <View style={styles.warehouseDetailRow}>
              <Phone color={theme.secondaryText} size={16} />
              <Text style={[styles.warehouseDetailText, { color: theme.secondaryText }]}>{warehouse.phone}</Text>
              <TouchableOpacity
                onPress={() => copyToClipboard(warehouse.phone, "Phone number")}
              >
                <Copy color={theme.primary} size={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.warehouseDetailRow}>
              <Clock color={theme.secondaryText} size={16} />
              <Text style={[styles.warehouseDetailText, { color: theme.secondaryText }]}>
                {warehouse.workingHours}
              </Text>
            </View>
          </View>
        </View>
      ))}
      {cargoWarehouses.length === 0 && (
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No warehouses available</Text>
      )}
    </View>
  );

  const renderReviewsTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.reviewsHeader}>
        <Text style={[styles.reviewsTitle, { color: theme.text }]}>
          {cargo.reviewCount} {t.verifiedReviews}
        </Text>
        <View style={[styles.ratingBadge, { backgroundColor: theme.warning + '20' }]}>
          <Star color={theme.star} size={18} fill={theme.star} />
          <Text style={[styles.ratingBadgeText, { color: theme.text }]}>{cargo.rating}</Text>
        </View>
      </View>
      {cargoReviews.map((review) => (
        <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <View style={styles.reviewHeader}>
            <View style={styles.reviewUser}>
              <View style={[styles.reviewAvatar, { backgroundColor: theme.primary }]}>
                <Text style={styles.reviewAvatarText}>
                  {review.userName.charAt(0)}
                </Text>
              </View>
              <View>
                <View style={styles.reviewNameRow}>
                  <Text style={[styles.reviewUserName, { color: theme.text }]}>{review.userName}</Text>
                  {review.isVerified && (
                    <CheckCircle color={theme.verified} size={14} />
                  )}
                </View>
                <Text style={[styles.reviewDate, { color: theme.secondaryText }]}>{review.date}</Text>
              </View>
            </View>
            <View style={[styles.reviewRatingContainer, { backgroundColor: theme.warning + '20' }]}>
              <Star color={theme.star} size={16} fill={theme.star} />
              <Text style={[styles.reviewRating, { color: theme.text }]}>{review.rating}</Text>
            </View>
          </View>
          <Text style={[styles.reviewComment, { color: theme.secondaryText }]}>{review.comment}</Text>
          <Text style={[styles.reviewTracking, { color: theme.secondaryText }]}>
            Tracking: {review.trackingNumber}
          </Text>
        </View>
      ))}
      {cargoReviews.length === 0 && (
        <Text style={[styles.emptyText, { color: theme.secondaryText }]}>No reviews yet</Text>
      )}
    </View>
  );

  const renderTrackingTab = () => (
    <View style={styles.tabContent}>
      <View style={[styles.trackingInfo, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Package color={theme.primary} size={32} />
        <Text style={[styles.trackingTitle, { color: theme.text }]}>Track Your Shipment</Text>
        <Text style={[styles.trackingDescription, { color: theme.secondaryText }]}>
          Use the Tracking tab to track your shipment with {cargo.name}
        </Text>
        <TouchableOpacity style={[styles.trackingButton, { backgroundColor: theme.primary }]}>
          <Text style={styles.trackingButtonText}>Go to Tracking</Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.trackingTip, { backgroundColor: theme.warning + '20', borderColor: theme.warning }]}>
        <Text style={[styles.trackingTipTitle, { color: theme.text }]}>💡 Tracking Tips</Text>
        <Text style={[styles.trackingTipText, { color: theme.secondaryText }]}>
          • Tracking numbers usually start working 24-48 hours after shipping
        </Text>
        <Text style={[styles.trackingTipText, { color: theme.secondaryText }]}>
          • Save your tracking number immediately after shipping
        </Text>
        <Text style={[styles.trackingTipText, { color: theme.secondaryText }]}>
          • Check status daily once the package is in transit
        </Text>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.secondaryBackground }]}>
      <View style={[styles.cargoHeader, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={[styles.logoLarge, { backgroundColor: theme.searchBackground }]}>
          <Text style={styles.logoLargeText}>{cargo.logo}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.headerNameRow}>
            <Text style={[styles.headerName, { color: theme.text }]}>{cargo.name}</Text>
            {cargo.isVerified && <Text style={[styles.verifiedBadge, { backgroundColor: theme.verified }]}>✓</Text>}
          </View>
          <View style={styles.headerMetrics}>
            <Star color={theme.star} size={16} fill={theme.star} />
            <Text style={[styles.headerRating, { color: theme.text }]}>{cargo.rating}</Text>
            <Text style={[styles.headerReviews, { color: theme.secondaryText }]}>
              ({cargo.reviewCount} {t.reviews.toLowerCase()})
            </Text>
          </View>
          <View style={styles.transportTypes}>
            {cargo.transportTypes.map((type) => (
              <View key={type} style={[styles.transportTypeBadge, { backgroundColor: theme.searchBackground }]}>
                <Text style={[styles.transportTypeBadgeText, { color: theme.secondaryText }]}>
                  {getTransportTypeLabel(type)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={[styles.statsBar, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{convertPrice(cargo.pricePerKg)}/kg</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>{t.avgPrice}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{cargo.avgDeliveryDays} {t.days}</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>{t.avgDelivery}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statValue, { color: theme.primary }]}>{cargo.reliabilityScore}%</Text>
          <Text style={[styles.statLabel, { color: theme.secondaryText }]}>{t.reliability}</Text>
        </View>
      </View>

      <View style={[styles.actionBar, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={styles.currencyGroup}>
          <TouchableOpacity
            style={[
              styles.currencyButtonSmall,
              { borderColor: theme.border },
              currency === 'USD' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setCurrency('USD')}
          >
            <Text style={[styles.currencyTextSmall, { color: currency === 'USD' ? '#ffffff' : theme.text }]}>USD</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.currencyButtonSmall,
              { borderColor: theme.border },
              currency === 'TJS' && { backgroundColor: theme.primary },
            ]}
            onPress={() => setCurrency('TJS')}
          >
            <Text style={[styles.currencyTextSmall, { color: currency === 'TJS' ? '#ffffff' : theme.text }]}>TJS</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          style={[styles.whatsappButton, { backgroundColor: '#25D366' }]}
          onPress={openWhatsApp}
        >
          <MessageCircle color="#ffffff" size={18} />
          <Text style={styles.whatsappText}>{t.whatsappSupport}</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.tabs, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "rates" && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab("rates")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.secondaryText },
              activeTab === "rates" && { color: theme.primary },
            ]}
          >
            {t.rates}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "warehouses" && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab("warehouses")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.secondaryText },
              activeTab === "warehouses" && { color: theme.primary },
            ]}
          >
            {t.warehouses}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "reviews" && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.secondaryText },
              activeTab === "reviews" && { color: theme.primary },
            ]}
          >
            {t.reviews}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "tracking" && { borderBottomColor: theme.primary }]}
          onPress={() => setActiveTab("tracking")}
        >
          <Text
            style={[
              styles.tabText,
              { color: theme.secondaryText },
              activeTab === "tracking" && { color: theme.primary },
            ]}
          >
            {t.tracking}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {activeTab === "rates" && renderRatesTab()}
        {activeTab === "warehouses" && renderWarehousesTab()}
        {activeTab === "reviews" && renderReviewsTab()}
        {activeTab === "tracking" && renderTrackingTab()}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
  },
  cargoHeader: {
    padding: 16,
    flexDirection: "row",
    borderBottomWidth: 1,
  },
  logoLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  logoLargeText: {
    fontSize: 36,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  headerNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "700" as const,
  },
  verifiedBadge: {
    fontSize: 14,
    color: "#ffffff",
    width: 20,
    height: 20,
    borderRadius: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  headerMetrics: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 8,
  },
  headerRating: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  headerReviews: {
    fontSize: 14,
  },
  transportTypes: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  transportTypeBadge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  transportTypeBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  statsBar: {
    flexDirection: "row",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    marginHorizontal: 8,
  },
  actionBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  currencyGroup: {
    flexDirection: "row",
    gap: 8,
  },
  currencyButtonSmall: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  currencyTextSmall: {
    fontSize: 12,
    fontWeight: "700" as const,
  },
  whatsappButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  whatsappText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  tabs: {
    flexDirection: "row",
    borderBottomWidth: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginBottom: -2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  scrollView: {
    flex: 1,
  },
  tabContent: {
    padding: 16,
  },
  tabDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  chartContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: "700" as const,
    marginBottom: 12,
  },
  chartArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 120,
    gap: 8,
  },
  chartBar: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  chartValue: {
    width: "100%",
    borderRadius: 4,
    marginBottom: 6,
  },
  chartLabel: {
    fontSize: 10,
  },
  rateCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  rateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  rateCategory: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  ratePrice: {
    fontSize: 20,
    fontWeight: "700" as const,
    textAlign: "right",
  },
  ratePriceAlt: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 2,
  },
  rateDetails: {
    gap: 6,
  },
  rateDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rateDetailLabel: {
    fontSize: 14,
  },
  rateDetailValue: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  warehouseCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  warehouseHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  warehouseName: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  warehouseInfo: {
    gap: 10,
  },
  warehouseCity: {
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 4,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  copyButton: {
    padding: 6,
    borderRadius: 6,
  },
  warehouseDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  warehouseDetailText: {
    flex: 1,
    fontSize: 14,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 16,
    fontWeight: "700" as const,
  },
  reviewCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  reviewUser: {
    flexDirection: "row",
    gap: 10,
    flex: 1,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  reviewAvatarText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  reviewNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  reviewUserName: {
    fontSize: 15,
    fontWeight: "600" as const,
  },
  reviewDate: {
    fontSize: 12,
    marginTop: 2,
  },
  reviewRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  reviewRating: {
    fontSize: 14,
    fontWeight: "700" as const,
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  reviewTracking: {
    fontSize: 12,
    fontStyle: "italic" as const,
  },
  trackingInfo: {
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  trackingTitle: {
    fontSize: 18,
    fontWeight: "600" as const,
    marginTop: 12,
    marginBottom: 8,
  },
  trackingDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  trackingButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  trackingButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  trackingTip: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  trackingTipTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    marginBottom: 10,
  },
  trackingTipText: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 32,
  },
});
