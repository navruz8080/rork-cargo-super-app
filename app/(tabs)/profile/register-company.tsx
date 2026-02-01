import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Building2, Upload } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterCompanyScreen() {
  const { t } = useLanguage();
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [warehouseAddress, setWarehouseAddress] = useState('');
  const [warehouseCity, setWarehouseCity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [logoUri, setLogoUri] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const pickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(t.error, 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setLogoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!companyName || !companyAddress || !companyPhone || !companyEmail || !pricePerKg || !deliveryTime || !warehouseAddress || !warehouseCity) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    if (!companyEmail.includes('@')) {
      Alert.alert(t.error, t.invalidEmail);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);

    Alert.alert(t.applicationSubmitted, t.applicationMessage);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.registerYourCompany}</Text>
        <Text style={styles.headerSubtitle}>{t.registerCompanyDesc}</Text>
      </View>

      <View style={styles.form}>
        {/* Logo Upload */}
        <View style={styles.logoSection}>
          <TouchableOpacity onPress={pickLogo} style={styles.logoContainer}>
            {logoUri ? (
              <Image source={{ uri: logoUri }} style={styles.logo} />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Building2 color="#64748b" size={48} />
                <Text style={styles.logoPlaceholderText}>{t.uploadLogo}</Text>
              </View>
            )}
            <View style={styles.uploadIcon}>
              <Upload color="#ffffff" size={20} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Company Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.contactInformation}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.companyName} *</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder={t.companyName}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.companyAddress} *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={companyAddress}
            onChangeText={setCompanyAddress}
            placeholder={t.companyAddress}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={2}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.companyPhone} *</Text>
          <TextInput
            style={styles.input}
            value={companyPhone}
            onChangeText={setCompanyPhone}
            placeholder="+992 XX XXX XXXX"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.companyEmail} *</Text>
          <TextInput
            style={styles.input}
            value={companyEmail}
            onChangeText={setCompanyEmail}
            placeholder="company@example.com"
            placeholderTextColor="#94a3b8"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Service Details */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.rates}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.pricePerKgLabel} *</Text>
          <TextInput
            style={styles.input}
            value={pricePerKg}
            onChangeText={setPricePerKg}
            placeholder="2.80"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.deliveryTimeLabel} *</Text>
          <TextInput
            style={styles.input}
            value={deliveryTime}
            onChangeText={setDeliveryTime}
            placeholder="15-20"
            placeholderTextColor="#94a3b8"
            keyboardType="number-pad"
          />
        </View>

        {/* Warehouse Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.warehouses}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.warehouseAddressChina} *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={warehouseAddress}
            onChangeText={setWarehouseAddress}
            placeholder={t.warehouseAddressChina}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.warehouseCity} *</Text>
          <TextInput
            style={styles.input}
            value={warehouseCity}
            onChangeText={setWarehouseCity}
            placeholder="Guangzhou / Yiwu"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Additional Information */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.additionalInfo}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={additionalInfo}
            onChangeText={setAdditionalInfo}
            placeholder={t.additionalInfo}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>{t.submit}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            📋 {t.applicationMessage}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
  },
  form: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 16,
    position: 'relative',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 16,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  logoPlaceholderText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadIcon: {
    position: 'absolute',
    right: -8,
    bottom: -8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0284c7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textArea: {
    height: 80,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  infoBox: {
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bae6fd',
  },
  infoText: {
    fontSize: 13,
    color: '#0c4a6e',
    lineHeight: 20,
  },
});
