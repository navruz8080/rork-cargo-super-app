import { Package, Mail, Phone, MapPin, Settings, Languages } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";

import { mockShipments } from "@/mocks/cargo-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/constants/translations";

export default function ProfileScreen() {
  const { language, setLanguage, t } = useLanguage();
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ' },
  ];

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
    const statusMap: Record<typeof status, string> = {
      pending: language === 'en' ? 'Pending' : language === 'ru' ? 'Ожидание' : 'Интизорӣ',
      in_transit: language === 'en' ? 'In Transit' : language === 'ru' ? 'В пути' : 'Дар роҳ',
      at_customs: language === 'en' ? 'At Customs' : language === 'ru' ? 'На таможне' : 'Дар гумрук',
      ready_for_pickup: language === 'en' ? 'Ready for Pickup' : language === 'ru' ? 'Готово к выдаче' : 'Омода барои гирифтан',
      delivered: language === 'en' ? 'Delivered' : language === 'ru' ? 'Доставлено' : 'Расонида шуд',
    };
    return statusMap[status] || 'Unknown';
  };

  const activeShipments = mockShipments.filter(
    (s) => s.status !== "delivered"
  ).length;
  const deliveredShipments = mockShipments.filter(
    (s) => s.status === "delivered"
  ).length;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>FK</Text>
          </View>
          <Text style={styles.userName}>Farruh Karimov</Text>
          <Text style={styles.userEmail}>farruh.k@example.com</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton}>
              <Settings color="#0284c7" size={18} />
              <Text style={styles.editButtonText}>
                {language === 'en' ? 'Edit Profile' : language === 'ru' ? 'Редактировать' : 'Таҳрир'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton} onPress={() => setShowLanguageModal(true)}>
              <Languages color="#0284c7" size={18} />
              <Text style={styles.languageButtonText}>
                {language === 'en' ? 'EN' : language === 'ru' ? 'РУ' : 'ТҶ'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeShipments}</Text>
            <Text style={styles.statLabel}>
              {language === 'en' ? 'Active' : language === 'ru' ? 'Активные' : 'Фаъол'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{deliveredShipments}</Text>
            <Text style={styles.statLabel}>
              {language === 'en' ? 'Delivered' : language === 'ru' ? 'Доставлено' : 'Расонида'}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mockShipments.length}</Text>
            <Text style={styles.statLabel}>
              {language === 'en' ? 'Total' : language === 'ru' ? 'Всего' : 'Ҳамаги'}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'Contact Information' : language === 'ru' ? 'Контактная информация' : 'Маълумоти тамос'}
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Mail color="#64748b" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {language === 'en' ? 'Email' : language === 'ru' ? 'Эл. почта' : 'Почтаи электронӣ'}
                </Text>
                <Text style={styles.infoValue}>farruh.k@example.com</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Phone color="#64748b" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {language === 'en' ? 'Phone' : language === 'ru' ? 'Телефон' : 'Телефон'}
                </Text>
                <Text style={styles.infoValue}>+992 92 777 8888</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <MapPin color="#64748b" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {language === 'en' ? 'Address' : language === 'ru' ? 'Адрес' : 'Суроға'}
                </Text>
                <Text style={styles.infoValue}>
                  Rudaki Ave 45, Dushanbe, Tajikistan
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.shipmentsSection}>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? 'My Shipments' : language === 'ru' ? 'Мои отправления' : 'Боркашиҳои ман'}
          </Text>
          {mockShipments.map((shipment) => (
            <View key={shipment.id} style={styles.shipmentCard}>
              <View style={styles.shipmentHeader}>
                <View style={styles.shipmentIconContainer}>
                  <Package color="#0284c7" size={20} />
                </View>
                <View style={styles.shipmentInfo}>
                  <Text style={styles.shipmentCargoName}>
                    {shipment.cargoName}
                  </Text>
                  <Text style={styles.shipmentTracking}>
                    {shipment.trackingNumber}
                  </Text>
                </View>
                <View
                  style={[
                    styles.shipmentStatusBadge,
                    {
                      backgroundColor: `${getStatusColor(shipment.status)}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.shipmentStatusText,
                      { color: getStatusColor(shipment.status) },
                    ]}
                  >
                    {getStatusLabel(shipment.status)}
                  </Text>
                </View>
              </View>
              <View style={styles.shipmentDetails}>
                <View style={styles.shipmentDetailRow}>
                  <Text style={styles.shipmentDetailLabel}>
                    {language === 'en' ? 'Weight:' : language === 'ru' ? 'Вес:' : 'Вазн:'}
                  </Text>
                  <Text style={styles.shipmentDetailValue}>
                    {shipment.weight} kg
                  </Text>
                </View>
                <View style={styles.shipmentDetailRow}>
                  <Text style={styles.shipmentDetailLabel}>
                    {language === 'en' ? 'Description:' : language === 'ru' ? 'Описание:' : 'Тавсиф:'}
                  </Text>
                  <Text style={styles.shipmentDetailValue}>
                    {shipment.description}
                  </Text>
                </View>
                <View style={styles.shipmentDetailRow}>
                  <Text style={styles.shipmentDetailLabel}>
                    {language === 'en' ? 'Est. Delivery:' : language === 'ru' ? 'Ожид. доставка:' : 'Расонидан:'}
                  </Text>
                  <Text style={styles.shipmentDetailValue}>
                    {shipment.estimatedDelivery}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>
              {language === 'en' ? 'Create New Shipment' : language === 'ru' ? 'Создать отправление' : 'Эҷоди фиристода'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              {language === 'en' ? 'Help & Support' : language === 'ru' ? 'Помощь и поддержка' : 'Кӯмак ва дастгирӣ'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {language === 'en' ? 'Select Language' : language === 'ru' ? 'Выберите язык' : 'Забонро интихоб кунед'}
            </Text>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageOption,
                  language === lang.code && styles.languageOptionActive,
                ]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLanguageModal(false);
                }}
              >
                <View style={styles.languageOptionContent}>
                  <Text style={styles.languageOptionName}>{lang.name}</Text>
                  <Text style={styles.languageOptionNative}>{lang.nativeName}</Text>
                </View>
                {language === lang.code && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  profileHeader: {
    backgroundColor: "#ffffff",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0284c7",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: "#64748b",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0284c7",
  },
  languageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0284c7",
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#0284c7",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#0284c7",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "700" as const,
    color: "#0284c7",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  infoSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#0f172a",
  },
  infoDivider: {
    height: 1,
    backgroundColor: "#f1f5f9",
    marginVertical: 14,
  },
  shipmentsSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  shipmentCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  shipmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  shipmentIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentCargoName: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#0f172a",
    marginBottom: 2,
  },
  shipmentTracking: {
    fontSize: 12,
    color: "#64748b",
    fontFamily: "monospace",
  },
  shipmentStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  shipmentStatusText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  shipmentDetails: {
    gap: 6,
  },
  shipmentDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  shipmentDetailLabel: {
    fontSize: 13,
    color: "#64748b",
  },
  shipmentDetailValue: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: "#0f172a",
    flex: 1,
    textAlign: "right",
  },
  actionsSection: {
    paddingHorizontal: 16,
    gap: 10,
  },
  actionButton: {
    backgroundColor: "#0284c7",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  actionButtonSecondary: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  actionButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: "#ffffff",
  },
  actionButtonTextSecondary: {
    color: "#0f172a",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    width: "85%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 16,
    textAlign: "center",
  },
  languageOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#f8fafc",
  },
  languageOptionActive: {
    backgroundColor: "#e0f2fe",
    borderWidth: 2,
    borderColor: "#0284c7",
  },
  languageOptionContent: {
    flex: 1,
  },
  languageOptionName: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#0f172a",
    marginBottom: 2,
  },
  languageOptionNative: {
    fontSize: 14,
    color: "#64748b",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#0284c7",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700" as const,
  },
});
