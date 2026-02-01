import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Pressable,
  RefreshControl,
} from "react-native";
import { Package, CheckCircle, Truck, Clock, TrendingUp, DollarSign, MapPin } from "lucide-react-native";
import { router } from "expo-router";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockShipments } from "@/mocks/cargo-data";
import { Colors } from "@/constants/colors";

const EXCHANGE_RATE = 11.25;

type FilterType = "all" | "active" | "delivered";

export default function MyShipmentsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "light"];
  const { t } = useLanguage();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };

  const filteredShipments = useMemo(() => {
    if (selectedFilter === "all") return mockShipments;
    if (selectedFilter === "active") {
      return mockShipments.filter(
        (s) => s.status !== "delivered"
      );
    }
    return mockShipments.filter((s) => s.status === "delivered");
  }, [selectedFilter]);

  const statistics = useMemo(() => {
    const total = mockShipments.length;
    const active = mockShipments.filter((s) => s.status !== "delivered").length;
    const delivered = mockShipments.filter((s) => s.status === "delivered").length;
    const totalWeight = mockShipments.reduce((sum, s) => sum + s.weight, 0);
    const totalCost = mockShipments.reduce(
      (sum, s) => sum + (s.codAmount || s.weight * 3.5 * EXCHANGE_RATE),
      0
    );

    return { total, active, delivered, totalWeight, totalCost };
  }, []);

  const getStatusColor = (status: typeof mockShipments[0]["status"]): string => {
    switch (status) {
      case "pending":
        return theme.warning;
      case "in_transit":
        return theme.primary;
      case "at_customs":
        return theme.primary;
      case "ready_for_pickup":
        return theme.success;
      case "delivered":
        return "#059669";
      default:
        return theme.secondaryText;
    }
  };

  const getStatusLabel = (status: typeof mockShipments[0]["status"]): string => {
    const statusMap: Record<typeof status, string> = {
      pending: t.pending,
      in_transit: t.inTransit,
      at_customs: t.atCustoms,
      ready_for_pickup: t.readyForPickup,
      delivered: t.delivered,
    };
    return statusMap[status] || "Unknown";
  };

  const getStatusIcon = (status: typeof mockShipments[0]["status"]) => {
    const color = getStatusColor(status);
    const size = 20;
    switch (status) {
      case "pending":
        return <Clock color={color} size={size} />;
      case "in_transit":
        return <Truck color={color} size={size} />;
      case "at_customs":
        return <Package color={color} size={size} />;
      case "ready_for_pickup":
        return <MapPin color={color} size={size} />;
      case "delivered":
        return <CheckCircle color={color} size={size} />;
      default:
        return <Package color={color} size={size} />;
    }
  };

  const filters: { value: FilterType; label: string; count: number }[] = [
    { value: "all", label: t.all, count: statistics.total },
    { value: "active", label: t.active, count: statistics.active },
    { value: "delivered", label: t.delivered, count: statistics.delivered },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Statistics Cards */}
      <View style={[styles.statsContainer, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.primary + "15" }]}>
              <Package color={theme.primary} size={24} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {statistics.total}
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {t.totalShipments}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.success + "15" }]}>
              <TrendingUp color={theme.success} size={24} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {statistics.totalWeight.toFixed(1)} kg
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {t.totalWeight}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: theme.warning + "15" }]}>
              <DollarSign color={theme.warning} size={24} />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]} numberOfLines={1} adjustsFontSizeToFit>
              {statistics.totalCost.toFixed(0)} TJS
            </Text>
            <Text style={[styles.statLabel, { color: theme.secondaryText }]}>
              {t.totalSpent}
            </Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={[styles.filtersContainer, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {filters.map((filter) => {
            const isSelected = selectedFilter === filter.value;
            return (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterButton,
                  { backgroundColor: theme.background, borderColor: theme.border },
                  isSelected && {
                    backgroundColor: theme.primary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => setSelectedFilter(filter.value)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    { color: theme.text },
                    isSelected && { color: "#ffffff" },
                  ]}
                >
                  {filter.label}
                </Text>
                <View
                  style={[
                    styles.filterBadge,
                    { backgroundColor: theme.secondaryText + "20" },
                    isSelected && { backgroundColor: "#ffffff30" },
                  ]}
                >
                  <Text
                    style={[
                      styles.filterBadgeText,
                      { color: theme.text },
                      isSelected && { color: "#ffffff" },
                    ]}
                  >
                    {filter.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Shipments List */}
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
        {filteredShipments.length > 0 ? (
          <View style={styles.shipmentsContainer}>
            {filteredShipments.map((shipment) => (
              <Pressable
                key={shipment.id}
                style={[
                  styles.shipmentCard,
                  { backgroundColor: theme.cardBackground, borderColor: theme.border },
                ]}
                onPress={() => {
                  // Navigate to tracking with pre-filled tracking number
                  router.push({
                    pathname: "/(tabs)/tracking",
                    params: { trackingNumber: shipment.trackingNumber },
                  });
                }}
              >
                {/* Card Header */}
                <View style={styles.shipmentHeader}>
                  <View style={[styles.shipmentIconContainer, { backgroundColor: theme.searchBackground }]}>
                    {getStatusIcon(shipment.status)}
                  </View>
                  <View style={styles.shipmentHeaderInfo}>
                    <Text style={[styles.shipmentCargoName, { color: theme.text }]} numberOfLines={1}>
                      {shipment.cargoName}
                    </Text>
                    <Text style={[styles.shipmentTracking, { color: theme.secondaryText }]} numberOfLines={1}>
                      {shipment.trackingNumber}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(shipment.status)}15` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: getStatusColor(shipment.status) },
                      ]}
                      numberOfLines={1}
                    >
                      {getStatusLabel(shipment.status)}
                    </Text>
                  </View>
                </View>

                {/* Card Body */}
                <View style={[styles.shipmentBody, { backgroundColor: theme.tableHeader }]}>
                  <View style={styles.shipmentDetailRow}>
                    <Text style={[styles.shipmentDetailLabel, { color: theme.secondaryText }]}>
                      {t.weight}
                    </Text>
                    <Text style={[styles.shipmentDetailValue, { color: theme.text }]}>
                      {shipment.weight} kg
                    </Text>
                  </View>
                  <View style={[styles.shipmentDivider, { backgroundColor: theme.border }]} />
                  <View style={styles.shipmentDetailRow}>
                    <Text style={[styles.shipmentDetailLabel, { color: theme.secondaryText }]}>
                      {t.cost}
                    </Text>
                    <Text style={[styles.shipmentDetailValue, { color: theme.primary, fontWeight: "700" }]}>
                      {(shipment.codAmount || shipment.weight * 3.5 * EXCHANGE_RATE).toFixed(2)} TJS
                    </Text>
                  </View>
                </View>

                {/* Card Footer */}
                <View style={styles.shipmentFooter}>
                  <View style={styles.shipmentFooterItem}>
                    <Clock color={theme.secondaryText} size={14} />
                    <Text style={[styles.shipmentFooterText, { color: theme.secondaryText }]}>
                      {shipment.estimatedDelivery}
                    </Text>
                  </View>
                  {shipment.pickupPoint && (
                    <View style={styles.shipmentFooterItem}>
                      <MapPin color={theme.secondaryText} size={14} />
                      <Text
                        style={[styles.shipmentFooterText, { color: theme.secondaryText }]}
                        numberOfLines={1}
                      >
                        {shipment.pickupPoint.split(",")[0]}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Quick Action Hint */}
                <View style={[styles.actionHint, { backgroundColor: theme.primary + "10" }]}>
                  <Text style={[styles.actionHintText, { color: theme.primary }]}>
                    {t.tapToTrack} →
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Package color={theme.secondaryText} size={64} />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
              {selectedFilter === "active" ? t.noActiveShipments : t.noDeliveredShipments}
            </Text>
            <Text style={[styles.emptyStateDescription, { color: theme.secondaryText }]}>
              {t.shipmentsEmptyHint}
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
  statsContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    fontSize: 11,
    textAlign: "center",
  },
  filtersContainer: {
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: "center",
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  content: {
    flex: 1,
  },
  shipmentsContainer: {
    padding: 16,
    gap: 12,
  },
  shipmentCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 12,
  },
  shipmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  shipmentIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  shipmentHeaderInfo: {
    flex: 1,
  },
  shipmentCargoName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  shipmentTracking: {
    fontSize: 12,
    fontFamily: "monospace",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    maxWidth: 120,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  shipmentBody: {
    flexDirection: "row",
    padding: 12,
    gap: 12,
  },
  shipmentDetailRow: {
    flex: 1,
    alignItems: "center",
  },
  shipmentDetailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  shipmentDetailValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  shipmentDivider: {
    width: 1,
  },
  shipmentFooter: {
    flexDirection: "row",
    padding: 12,
    paddingTop: 8,
    gap: 16,
  },
  shipmentFooterItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  shipmentFooterText: {
    fontSize: 12,
    flex: 1,
  },
  actionHint: {
    padding: 8,
    alignItems: "center",
  },
  actionHintText: {
    fontSize: 12,
    fontWeight: "600",
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
