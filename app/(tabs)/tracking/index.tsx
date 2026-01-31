import { Search, Package, CheckCircle, Truck } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { mockShipments } from "@/mocks/cargo-data";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TrackingScreen() {
  const { language } = useLanguage();
  const [trackingNumber, setTrackingNumber] = useState<string>("");
  const [searchedShipment, setSearchedShipment] = useState<
    (typeof mockShipments)[0] | null
  >(null);

  const handleSearch = () => {
    if (!trackingNumber.trim()) {
      const errorTitle = language === 'en' ? 'Error' : language === 'ru' ? 'Ошибка' : 'Хато';
      const errorMsg = language === 'en' ? 'Please enter a tracking number' : language === 'ru' ? 'Введите трек-номер' : 'Рақами пайгириро ворид кунед';
      Alert.alert(errorTitle, errorMsg);
      return;
    }

    const shipment = mockShipments.find(
      (s) => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
    );

    if (shipment) {
      setSearchedShipment(shipment);
    } else {
      const notFoundTitle = language === 'en' ? 'Not Found' : language === 'ru' ? 'Не найдено' : 'Ёфт нашуд';
      const notFoundMsg = language === 'en' ? 'No shipment found with this tracking number. Please check and try again.' : language === 'ru' ? 'Отправление с таким номером не найдено. Проверьте и попробуйте снова.' : 'Бо ин рақам боркашӣ ёфт нашуд. Лутфан санҷед ва аз нав кӯшиш кунед.';
      Alert.alert(notFoundTitle, notFoundMsg);
      setSearchedShipment(null);
    }
  };

  const getStatusColor = (
    status: (typeof mockShipments)[0]["status"]
  ): string => {
    switch (status) {
      case "pending":
        return "#64748b";
      case "in_transit":
        return "#0284c7";
      case "at_customs":
        return "#f59e0b";
      case "ready_for_pickup":
        return "#10b981";
      case "delivered":
        return "#059669";
      default:
        return "#64748b";
    }
  };

  const getStatusLabel = (
    status: (typeof mockShipments)[0]["status"]
  ): string => {
    const statusMap: Record<typeof status, Record<string, string>> = {
      pending: { en: 'Pending', ru: 'Ожидание', tg: 'Интизорӣ' },
      in_transit: { en: 'In Transit', ru: 'В пути', tg: 'Дар роҳ' },
      at_customs: { en: 'At Customs', ru: 'На таможне', tg: 'Дар гумрук' },
      ready_for_pickup: { en: 'Ready for Pickup', ru: 'Готово к выдаче', tg: 'Омода барои гирифтан' },
      delivered: { en: 'Delivered', ru: 'Доставлено', tg: 'Расонида шуд' },
    };
    return statusMap[status]?.[language] || 'Unknown';
  };

  const getStatusIcon = (status: (typeof mockShipments)[0]["status"]) => {
    const color = getStatusColor(status);
    switch (status) {
      case "pending":
        return <Package color={color} size={24} />;
      case "in_transit":
        return <Truck color={color} size={24} />;
      case "at_customs":
        return <Package color={color} size={24} />;
      case "ready_for_pickup":
        return <CheckCircle color={color} size={24} />;
      case "delivered":
        return <CheckCircle color={color} size={24} />;
      default:
        return <Package color={color} size={24} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>
          {language === 'en' ? 'Track Your Shipment' : language === 'ru' ? 'Отследить посылку' : 'Пайгирии боркашӣ'}
        </Text>
        <Text style={styles.searchDescription}>
          {language === 'en' ? 'Enter your tracking number to see real-time status' : language === 'ru' ? 'Введите трек-номер для просмотра статуса' : 'Рақами пайгириро барои дидани вазъият ворид кунед'}
        </Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder={language === 'en' ? 'Enter tracking number...' : language === 'ru' ? 'Введите трек-номер...' : 'Рақами пайгириро ворид кунед...'}
            placeholderTextColor="#94a3b8"
            value={trackingNumber}
            onChangeText={setTrackingNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Search color="#ffffff" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchedShipment && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>
              {language === 'en' ? 'Tracking Results' : language === 'ru' ? 'Результаты отслеживания' : 'Натиҷаҳои пайгирӣ'}
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
                    {language === 'en' ? 'Weight:' : language === 'ru' ? 'Вес:' : 'Вазн:'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.weight} kg
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'en' ? 'Description:' : language === 'ru' ? 'Описание:' : 'Тавсиф:'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.description}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'en' ? 'Created:' : language === 'ru' ? 'Создано:' : 'Эҷод шуд:'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.createdAt}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>
                    {language === 'en' ? 'Est. Delivery:' : language === 'ru' ? 'Ожид. доставка:' : 'Расонидан:'}
                  </Text>
                  <Text style={styles.detailValue}>
                    {searchedShipment.estimatedDelivery}
                  </Text>
                </View>
                {searchedShipment.pickupPoint && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>
                      {language === 'en' ? 'Pickup Point:' : language === 'ru' ? 'Пункт выдачи:' : 'Нуқтаи гирифтан:'}
                    </Text>
                    <Text style={styles.detailValue}>
                      {searchedShipment.pickupPoint}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.timeline}>
                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      styles.timelineDotCompleted,
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {language === 'en' ? 'Order Created' : language === 'ru' ? 'Заказ создан' : 'Фармоиш эҷод шуд'}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {searchedShipment.createdAt}
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      searchedShipment.status !== "pending" &&
                        styles.timelineDotCompleted,
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {language === 'en' ? 'In Transit' : language === 'ru' ? 'В пути' : 'Дар роҳ'}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {searchedShipment.status !== "pending"
                        ? (language === 'en' ? 'In progress' : language === 'ru' ? 'В процессе' : 'Дар ҷараён')
                        : (language === 'en' ? 'Pending' : language === 'ru' ? 'Ожидание' : 'Интизорӣ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      (searchedShipment.status === "at_customs" ||
                        searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered") &&
                        styles.timelineDotCompleted,
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {language === 'en' ? 'At Customs' : language === 'ru' ? 'На таможне' : 'Дар гумрук'}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {searchedShipment.status === "at_customs" ||
                      searchedShipment.status === "ready_for_pickup" ||
                      searchedShipment.status === "delivered"
                        ? (language === 'en' ? 'Cleared' : language === 'ru' ? 'Прошло' : 'Гузашт')
                        : (language === 'en' ? 'Pending' : language === 'ru' ? 'Ожидание' : 'Интизорӣ')}
                    </Text>
                  </View>
                </View>

                <View style={styles.timelineItem}>
                  <View
                    style={[
                      styles.timelineDot,
                      (searchedShipment.status === "ready_for_pickup" ||
                        searchedShipment.status === "delivered") &&
                        styles.timelineDotCompleted,
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {language === 'en' ? 'Ready for Pickup' : language === 'ru' ? 'Готово к выдаче' : 'Омода барои гирифтан'}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {searchedShipment.status === "ready_for_pickup" ||
                      searchedShipment.status === "delivered"
                        ? searchedShipment.estimatedDelivery
                        : (language === 'en' ? 'Pending' : language === 'ru' ? 'Ожидание' : 'Интизорӣ')}
                    </Text>
                  </View>
                </View>

                <View style={[styles.timelineItem, styles.timelineItemLast]}>
                  <View
                    style={[
                      styles.timelineDot,
                      searchedShipment.status === "delivered" &&
                        styles.timelineDotCompleted,
                    ]}
                  />
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>
                      {language === 'en' ? 'Delivered' : language === 'ru' ? 'Доставлено' : 'Расонида шуд'}
                    </Text>
                    <Text style={styles.timelineDate}>
                      {searchedShipment.status === "delivered"
                        ? (language === 'en' ? 'Completed' : language === 'ru' ? 'Завершено' : 'Анҷом ёфт')
                        : (language === 'en' ? 'Pending' : language === 'ru' ? 'Ожидание' : 'Интизорӣ')}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>
            💡 {language === 'en' ? 'Tracking Tips' : language === 'ru' ? 'Советы по отслеживанию' : 'Маслиҳатҳои пайгирӣ'}
          </Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>
                {language === 'en' ? 'Try these:' : language === 'ru' ? 'Попробуйте эти:' : 'Инҳоро санҷед:'}
              </Text>
            </Text>
            <Text style={styles.tipExample}>• EA2024010001TJ</Text>
            <Text style={styles.tipExample}>• DE2024010015TJ</Text>
            <Text style={styles.tipExample}>• SR2023120050TJ</Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>
                {language === 'en' ? 'Multiple Carriers:' : language === 'ru' ? 'Несколько перевозчиков:' : 'Чанд ҳамлбарор:'}
              </Text>{' '}
              {language === 'en' ? 'Our unified tracking works with all cargo companies. Just enter your tracking number!' : language === 'ru' ? 'Наша единая система отслеживания работает со всеми грузовыми компаниями. Просто введите трек-номер!' : 'Системаи якпорчаи пайгирии мо бо ҳамаи ширкатҳои боркаш кор мекунад. Факат рақами пайгириро ворид кунед!'}
            </Text>
          </View>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              <Text style={styles.tipBold}>
                {language === 'en' ? 'Updates:' : language === 'ru' ? 'Обновления:' : 'Навсозиҳо:'}
              </Text>{' '}
              {language === 'en' ? 'Tracking info updates every 6 hours. Check back regularly for the latest status.' : language === 'ru' ? 'Информация о отслеживании обновляется каждые 6 часов. Проверяйте регулярно для получения последнего статуса.' : 'Маълумоти пайгирӣ ҳар 6 соат нав мешавад. Барои гирифтани охирин вазъият мунтазам санҷед.'}
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
  timeline: {
    paddingTop: 8,
  },
  timelineItem: {
    flexDirection: "row",
    paddingBottom: 20,
  },
  timelineItemLast: {
    paddingBottom: 0,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#e2e8f0",
    marginRight: 12,
    marginTop: 4,
    position: "relative" as const,
  },
  timelineDotCompleted: {
    backgroundColor: "#0284c7",
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#0f172a",
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 13,
    color: "#64748b",
  },
  tipsSection: {
    padding: 16,
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
