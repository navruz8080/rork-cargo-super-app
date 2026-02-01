import { Package, Mail, Phone, MapPin, Settings, Languages, Building2, LogOut, Camera, Star, Clock } from "lucide-react-native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
  Alert,
  Image,
} from "react-native";
import { router } from "expo-router";

import { mockShipments } from "@/mocks/cargo-data";
import { useLanguage } from "@/contexts/LanguageContext";
import { useUser } from "@/contexts/UserContext";
import { Language } from "@/constants/translations";

export default function ProfileScreen() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useUser();
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
      pending: t.pending,
      in_transit: t.inTransit,
      at_customs: t.atCustoms,
      ready_for_pickup: t.readyForPickup,
      delivered: t.delivered,
    };
    return statusMap[status] || 'Unknown';
  };

  const activeShipments = mockShipments.filter(
    (s) => s.status !== "delivered"
  ).length;
  const deliveredShipments = mockShipments.filter(
    (s) => s.status === "delivered"
  ).length;

  const handleLogout = () => {
    Alert.alert(
      t.logout,
      language === 'en' ? 'Are you sure you want to logout?' : language === 'ru' ? 'Вы уверены, что хотите выйти?' : 'Шумо мутмаин ҳастед, ки мехоҳед баромад кунед?',
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.logout,
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleCreateShipment = () => {
    router.push('/profile/create-shipment');
  };

  const handleHelp = () => {
    router.push('/profile/help');
  };

  const handleRegisterCompany = () => {
    router.push('/profile/register-company');
  };

  const openBusinessWhatsApp = () => {
    const adminNumber = "+992927778888"; // Admin/business contact
    const message = language === 'en'
      ? "Hello! I want to register my cargo company on Drop Logistics. Please send me the requirements."
      : language === 'ru'
        ? "Здравствуйте! Я хочу зарегистрировать свою грузовую компанию в Drop Logistics. Пожалуйста, отправьте мне требования."
        : "Салом! Ман мехоҳам ширкати боркашии худро дар Drop Logistics сабт кунам. Лутфан талаботро барои ман фиристед.";
    
    const url = `whatsapp://send?phone=${adminNumber}&text=${encodeURIComponent(message)}`;
    
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(t.error, t.whatsappNotInstalled);
        }
      })
      .catch(() => {
        Alert.alert(t.error, t.couldNotOpenWhatsApp);
      });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeader}>
          <TouchableOpacity style={styles.avatar} onPress={handleEditProfile}>
            {user?.photoUri ? (
              <Image source={{ uri: user.photoUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </Text>
              </View>
            )}
            <View style={styles.cameraIconContainer}>
              <Camera color="#ffffff" size={16} />
            </View>
          </TouchableOpacity>
          <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Settings color="#0284c7" size={18} />
              <Text style={styles.editButtonText}>
                {t.editProfile}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton} onPress={() => setShowLanguageModal(true)}>
              <Languages color="#0284c7" size={18} />
              <Text style={styles.languageButtonText}>
                {language === 'en' ? 'EN' : language === 'ru' ? 'РУ' : 'ТҶ'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageButton} onPress={() => router.push('/profile/settings')}>
              <Settings color="#0284c7" size={18} />
              <Text style={styles.languageButtonText}>
                {t.settings}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut color="#ef4444" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{activeShipments}</Text>
            <Text style={styles.statLabel}>
              {t.active}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{deliveredShipments}</Text>
            <Text style={styles.statLabel}>
              {t.delivered}
            </Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{mockShipments.length}</Text>
            <Text style={styles.statLabel}>
              {t.total}
            </Text>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>
            {t.contactInformation}
          </Text>
          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Mail color="#64748b" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t.email}
                </Text>
                <Text style={styles.infoValue}>{user?.email || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <Phone color="#64748b" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t.phone}
                </Text>
                <Text style={styles.infoValue}>{user?.phone || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.infoDivider} />
            <View style={styles.infoRow}>
              <MapPin color="#64748b" size={20} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>
                  {t.address}
                </Text>
                <Text style={styles.infoValue}>
                  {user?.address || 'Not specified'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.shipmentsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {t.myShipments}
            </Text>
            <TouchableOpacity onPress={() => router.push('/profile/my-shipments')}>
              <Text style={styles.seeAllLink}>{t.seeAll} →</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.shipmentsStatsCard}>
            <View style={styles.shipmentsStat}>
              <Text style={styles.shipmentsStatValue}>{activeShipments}</Text>
              <Text style={styles.shipmentsStatLabel}>{t.active}</Text>
            </View>
            <View style={styles.shipmentsStatDivider} />
            <View style={styles.shipmentsStat}>
              <Text style={styles.shipmentsStatValue}>{deliveredShipments}</Text>
              <Text style={styles.shipmentsStatLabel}>{t.delivered}</Text>
            </View>
            <View style={styles.shipmentsStatDivider} />
            <View style={styles.shipmentsStat}>
              <Text style={styles.shipmentsStatValue}>{mockShipments.length}</Text>
              <Text style={styles.shipmentsStatLabel}>{t.total}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.viewAllShipmentsButton}
            onPress={() => router.push('/profile/my-shipments')}
          >
            <Package color="#0284c7" size={20} />
            <Text style={styles.viewAllShipmentsText}>{t.viewAllShipments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewAllShipmentsButton, { backgroundColor: "#fef3c7", borderColor: "#f59e0b" }]}
            onPress={() => router.push('/profile/favorites')}
          >
            <Star color="#f59e0b" size={20} fill="#f59e0b" />
            <Text style={[styles.viewAllShipmentsText, { color: "#f59e0b" }]}>{t.viewFavorites}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewAllShipmentsButton, { backgroundColor: "#e0f2fe", borderColor: "#0284c7" }]}
            onPress={() => router.push('/profile/view-history')}
          >
            <Clock color="#0284c7" size={20} />
            <Text style={[styles.viewAllShipmentsText, { color: "#0284c7" }]}>{t.viewHistory}</Text>
          </TouchableOpacity>
        </View>

        {/* For Business Section */}
        <View style={styles.businessSection}>
          <Text style={styles.sectionTitle}>
            {t.forBusiness}
          </Text>
          <TouchableOpacity 
            style={styles.businessCard}
            onPress={handleRegisterCompany}
          >
            <View style={styles.businessIconContainer}>
              <Building2 color="#0284c7" size={24} />
            </View>
            <View style={styles.businessCardContent}>
              <Text style={styles.businessCardTitle}>
                {t.listYourCargo}
              </Text>
              <Text style={styles.businessCardDescription}>
                {t.registerCompanyDesc}
              </Text>
            </View>
            <Text style={styles.businessCardArrow}>→</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCreateShipment}>
            <Text style={styles.actionButtonText}>
              {t.createNewShipment}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]} onPress={handleHelp}>
            <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
              {t.helpSupport}
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
              {t.selectLanguage}
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
    position: 'relative',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0284c7",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700" as const,
    color: "#ffffff",
  },
  cameraIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#0284c7",
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: 'center',
    justifyContent: 'center',
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ef4444",
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  seeAllLink: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#0284c7",
  },
  shipmentsStatsCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    gap: 16,
  },
  shipmentsStat: {
    flex: 1,
    alignItems: "center",
  },
  shipmentsStatValue: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: "#0284c7",
    marginBottom: 4,
  },
  shipmentsStatLabel: {
    fontSize: 12,
    color: "#64748b",
  },
  shipmentsStatDivider: {
    width: 1,
    backgroundColor: "#e2e8f0",
  },
  viewAllShipmentsButton: {
    backgroundColor: "#e0f2fe",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 2,
    borderColor: "#0284c7",
  },
  viewAllShipmentsText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#0284c7",
  },
  businessSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  businessCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#0284c7",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#0284c7",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
  },
  businessCardContent: {
    flex: 1,
  },
  businessCardTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#0f172a",
    marginBottom: 4,
  },
  businessCardDescription: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 18,
  },
  businessCardArrow: {
    fontSize: 24,
    color: "#0284c7",
    fontWeight: "700" as const,
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
