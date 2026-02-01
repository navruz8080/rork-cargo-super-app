import { Search, Package, CheckCircle, Truck, MapPin, Clock, AlertCircle, Plane } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

import { mockShipments } from "@/mocks/cargo-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Colors } from "@/constants/colors";

// Financial Dashboard Exchange Rate
const EXCHANGE_RATE = 11.25;

export default function TrackingScreen() {
  const { language, t } = useLanguage();
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [searchedShipment, setSearchedShipment] = useState<
    (typeof mockShipments)[0] | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!trackingNumber.trim()) {
      Alert.alert(t.error, t.pleaseEnterTracking);
      return;
    }
    
    setIsSearching(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Search by full tracking number or partial number match
    const searchTerm = trackingNumber.trim().toLowerCase();
    const shipment = mockShipments.find(
      (s) => 
        s.trackingNumber.toLowerCase() === searchTerm ||
        s.trackingNumber.toLowerCase().includes(searchTerm) ||
        s.trackingNumber.match(new RegExp(searchTerm, 'i'))
    );

    if (shipment) {
      setSearchedShipment(shipment);
    } else {
      Alert.alert(t.notFound, t.noShipmentFound);
      setSearchedShipment(null);
    }
    
    setIsSearching(false);
  };

  const getStatusColor = (
    status: (typeof mockShipments)[0]["status"]
  ): string => {
    switch (status) {
      case "pending":
        return "#f59e0b"; // Yellow - In China
      case "in_transit":
        return "#0284c7"; // Blue - In Transit
      case "at_customs":
        return "#0284c7"; // Blue - In Transit
      case "ready_for_pickup":
        return "#10b981"; // Green - Ready in Khujand/Dushanbe
      case "delivered":
        return "#059669"; // Dark Green - Delivered
      default:
        return "#64748b";
    }
  };

  const getStatusLabel = (
    status: (typeof mockShipments)[0]["status"]
  ): string => {
    const statusMap: Record<typeof status, string> = {
      pending: t.pending,
      in_transit: t.inTransit,
      at_customs: t.atCustoms,
      ready_for_pickup: t.readyForPickup,
      delivered: t.delivered,
    };
    return statusMap[status] || 'Unknown';
  };

  const getStatusIcon = (status: (typeof mockShipments)[0]["status"]) => {
    const color = getStatusColor(status);
    switch (status) {
      case "pending":
        return <MapPin color={color} size={24} />; // In China
      case "in_transit":
        return <Plane color={color} size={24} />; // In Transit
      case "at_customs":
        return <Truck color={color} size={24} />; // At Customs
      case "ready_for_pickup":
        return <CheckCircle color={color} size={24} />; // Ready
      case "delivered":
        return <CheckCircle color={color} size={24} />; // Delivered
      default:
        return <Package color={color} size={24} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle} numberOfLines={1} adjustsFontSizeToFit>
          {t.trackYourShipment}
        </Text>
        <Text style={styles.searchDescription}>
          {t.enterTrackingNumber}
        </Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={t.enterTrackingPlaceholder}
            placeholderTextColor="#94a3b8"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity 
            style={styles.searchButton} 
            onPress={handleSearch}
            disabled={isSearching}
          >
            {isSearching ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Search color="#ffffff" size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchedShipment && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>
              {t.trackingResults}
            </Text>
            <View style={styles.shipmentCard}>
              <View style={styles.shipmentHeader}>
                <View style={styles.statusIconContainer}>
                  {getStatusIcon(searchedShipment.status)}
                </View>
                <View style={styles.shipmentHeaderInfo}>
                  <Text style={styles.shipmentCargoName}>
                    {searchedShipment.cargoName}
                  </Text>
                  <Text style={styles.shipmentTracking}>
                    {searchedShipment.trackingNumber}
                  </Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: `${getStatusColor(searchedShipment.status)}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      { color: getStatusColor(searchedShipment.status) },
                    ]}
                  >
                    {getStatusLabel(searchedShipment.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.shipmentDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t.weight}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.weight} kg
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t.description}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.description}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {t.estDelivery}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.estimatedDelivery}
                  </Text>
                </View>
                {(searchedShipment.status === "ready_for_pickup" || searchedShipment.status === "delivered") && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: "#10b981", fontWeight: "700" }]}>
                      {t.finalPrice}
                    </Text>
                    <Text style={[styles.detailValue, { color: "#10b981", fontSize: 16, fontWeight: "800" }]}>
                      {searchedShipment.codAmount?.toFixed(2) || (searchedShipment.weight * 3.5 * EXCHANGE_RATE).toFixed(2)} TJS
                    </Text>
                  </View>
                )}
                {searchedShipment.pickupPoint && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {t.address}
                    </Text>
                    <Text style={styles.detailValue}>
                      {searchedShipment.pickupPoint}
                    </Text>
                  </View>
                )}
              </View>

              {/* COD Banner for Ready for Pickup */}
              {searchedShipment.status === "ready_for_pickup" && (
                <View style={styles.codBanner}>
                  <AlertCircle color="#854d0e" size={24} />
                  <View style={styles.codBannerContent}>
                    <Text style={styles.codBannerTitle}>
                      {t.statusReadyForPickup}
                    </Text>
                    <Text style={styles.codBannerAmount}>
                      {t.amountToPay}
                      <Text style={styles.codBannerAmountValue}>
                        {searchedShipment.codAmount?.toFixed(2) || (searchedShipment.weight * 3.5 * EXCHANGE_RATE).toFixed(2)} TJS
                      </Text>
                    </Text>
                  </View>
                </View>
              )}

              {/* Enhanced Vertical Timeline */}
              <View style={styles.timeline}>
                {/* Step 1: Label Created */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[
                      styles.timelineDot,
                      styles.timelineDotCompleted,
                    ]}>
                      <Package color="#ffffff" size={16} />
                    </View>
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTitleContainer}>
                      <Package color="#0284c7" size={18} />
                      <Text style={styles.timelineTitle}>
                        {t.labelCreated}
                      </Text>
                    </View>
                    <Text style={styles.timelineDate}>
                      {searchedShipment.createdAt}
                    </Text>
                    <Text style={styles.timelineDescription}>
                      {t.packageRegistered}
                    </Text>
                  </View>
                </View>

                {/* Step 2: Arrived at China Hub */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[
                      styles.timelineDot,
                      (searchedShipment.status !== "pending") && styles.timelineDotCompleted,
                    ]}>
                      <MapPin color={(searchedShipment.status !== "pending") ? "#ffffff" : "#64748b"} size={16} />
                    </View>
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTitleContainer}>
                      <MapPin color="#0284c7" size={18} />
                      <Text style={styles.timelineTitle}>
                        {t.arrivedChinaHub}
                      </Text>
                    </View>
                    <Text style={styles.timelineDate}>
                      {(searchedShipment.status !== "pending") ? t.processed : t.pending}
                    </Text>
                    <Text style={styles.timelineDescription}>
                      {t.packageAtWarehouse}
                    </Text>
                  </View>
                </View>

                {/* Step 3: In Transit */}
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[
                      styles.timelineDot,
                      (searchedShipment.status === "in_transit" ||
                        searchedShipment.status === "at_customs" ||
                        searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered") && styles.timelineDotCompleted,
                    ]}>
                      <Plane color={(searchedShipment.status === "in_transit" ||
                        searchedShipment.status === "at_customs" ||
                        searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered") ? "#ffffff" : "#64748b"} size={16} />
                    </View>
                    <View style={styles.timelineLine} />
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTitleContainer}>
                      <Plane color="#0284c7" size={18} />
                      <Text style={styles.timelineTitle}>
                        {t.packageInTransit}
                      </Text>
                    </View>
                    <Text style={styles.timelineDate}>
                      {(searchedShipment.status === "in_transit" ||
                        searchedShipment.status === "at_customs" ||
                        searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered")
                        ? t.onTheWay
                        : t.waitingArrival}
                    </Text>
                    <Text style={styles.timelineDescription}>
                      {t.packageTransporting}
                    </Text>
                  </View>
                </View>

                {/* Step 4: Ready at Destination */}
                <View style={[styles.timelineItem, styles.timelineItemLast]}>
                  <View style={styles.timelineLeftColumn}>
                    <View style={[
                      styles.timelineDot,
                      (searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered") && styles.timelineDotCompleted,
                    ]}>
                      <CheckCircle color={(searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered") ? "#ffffff" : "#64748b"} size={16} />
                    </View>
                  </View>
                  <View style={styles.timelineContent}>
                    <View style={styles.timelineTitleContainer}>
                      <CheckCircle color="#10b981" size={18} />
                      <Text style={styles.timelineTitle}>
                        {t.readyAtDestination}
                      </Text>
                    </View>
                    <Text style={styles.timelineDate}>
                      {(searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered")
                        ? searchedShipment.estimatedDelivery
                        : t.waitingArrival}
                    </Text>
                    <Text style={styles.timelineDescription}>
                      {(searchedShipment.status === "ready_for_pickup")
                        ? t.payOnDelivery
                        : (searchedShipment.status === "delivered")
                          ? t.packageDeliveredSuccess
                          : t.waitingArrival}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.tipsSection}>
          <View style={styles.tipsSectionHeader}>
            <AlertCircle color="#0284c7" size={20} />
            <Text style={styles.sectionTitle}>
              {t.trackingTips}
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>
                {t.tryThese}
              </Text>
            </Text>
            <Text style={styles.tipExample}>• EA2024010001TJ</Text>
            <Text style={styles.tipExample}>• DE2024010015TJ (or just "10015")</Text>
            <Text style={styles.tipExample}>• SR2023120050TJ (or just "50")</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>
                {t.multipleCarriers}
              </Text>{' '}
              {t.multipleCarriersDesc}
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>
                {t.updates}
              </Text>{' '}
              {t.updatesDesc}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  searchSection: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 4,
  },
  searchDescription: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#0f172a",
  },
  searchButton: {
    width: 48,
    height: 48,
    backgroundColor: "#0284c7",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  resultSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 12,
  },
  shipmentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  shipmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  shipmentHeaderInfo: {
    flex: 1,
  },
  shipmentCargoName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#0f172a",
    marginBottom: 2,
  },
  shipmentTracking: {
    fontSize: 13,
    color: "#64748b",
    fontFamily: "monospace",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  shipmentDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailLabel: {
    fontSize: 14,
    color: "#64748b",
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#0f172a",
    flex: 1,
    textAlign: "right",
  },
  codBanner: {
    backgroundColor: "#fef3c7",
    borderColor: "#f59e0b",
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#f59e0b",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  codBannerContent: {
    flex: 1,
  },
  codBannerTitle: {
    fontSize: 14,
    fontWeight: "800" as const,
    color: "#78350f",
    marginBottom: 6,
    letterSpacing: 0.5,
    textTransform: "uppercase" as const,
  },
  codBannerAmount: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#92400e",
  },
  codBannerAmountValue: {
    fontSize: 18,
    fontWeight: "900" as const,
    color: "#78350f",
  },
  timeline: {
    paddingTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 24,
  },
  timelineItemLast: {
    paddingBottom: 0,
  },
  timelineLeftColumn: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  timelineDotCompleted: {
    backgroundColor: "#0284c7",
  },
  timelineLine: {
    width: 3,
    flex: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 2,
  },
  timelineTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#0f172a",
  },
  timelineDate: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 6,
  },
  timelineDescription: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
  },
  tipsSection: {
    padding: 16,
  },
  tipsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tipCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  tipText: {
    fontSize: 14,
    color: "#475569",
    lineHeight: 20,
  },
  tipBold: {
    fontWeight: "600" as const,
    color: "#0f172a",
  },
  tipExample: {
    fontSize: 13,
    color: "#64748b",
    fontFamily: "monospace",
    marginTop: 4,
  },
});
