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
} from 'react-native';
import { router } from 'expo-router';
import { Package } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockCargos } from '@/mocks/cargo-data';

export default function CreateShipmentScreen() {
  const { t } = useLanguage();
  const [selectedCargo, setSelectedCargo] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [instructions, setInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCargoList, setShowCargoList] = useState(false);

  const handleSubmit = async () => {
    if (!selectedCargo || !weight || !description || !recipientName || !recipientPhone || !deliveryAddress) {
      Alert.alert(t.error, t.fillAllFields);
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);

    Alert.alert(t.success, t.shipmentCreated);
    router.back();
  };

  const selectedCargoData = mockCargos.find(c => c.id === selectedCargo);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.form}>
        {/* Cargo Company Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.selectCargoCompany} *</Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => setShowCargoList(!showCargoList)}
          >
            <Text style={[styles.selectButtonText, selectedCargoData && styles.selectButtonTextSelected]}>
              {selectedCargoData ? selectedCargoData.name : t.selectCargoCompany}
            </Text>
          </TouchableOpacity>
          {showCargoList && (
            <View style={styles.cargoList}>
              {mockCargos.map(cargo => (
                <TouchableOpacity
                  key={cargo.id}
                  style={styles.cargoItem}
                  onPress={() => {
                    setSelectedCargo(cargo.id);
                    setShowCargoList(false);
                  }}
                >
                  <Package color="#0284c7" size={20} />
                  <View style={styles.cargoItemInfo}>
                    <Text style={styles.cargoItemName}>{cargo.name}</Text>
                    <Text style={styles.cargoItemPrice}>
                      ${cargo.pricePerKg} / kg • {cargo.deliveryDays} {t.days}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Package Details */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.packageWeight} *</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="5.5"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.packageDescription} *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t.packageDescription}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.estimatedValue}</Text>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setValue}
            placeholder="100"
            placeholderTextColor="#94a3b8"
            keyboardType="decimal-pad"
          />
        </View>

        {/* Recipient Information */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.contactInformation}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.recipientName} *</Text>
          <TextInput
            style={styles.input}
            value={recipientName}
            onChangeText={setRecipientName}
            placeholder={t.recipientName}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.recipientPhone} *</Text>
          <TextInput
            style={styles.input}
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            placeholder="+992 XX XXX XXXX"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.deliveryAddress} *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={deliveryAddress}
            onChangeText={setDeliveryAddress}
            placeholder={t.deliveryAddress}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={3}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t.specialInstructions}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={instructions}
            onChangeText={setInstructions}
            placeholder={t.specialInstructions}
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={2}
          />
        </View>

        {/* Price Estimate */}
        {selectedCargoData && weight && (
          <View style={styles.priceEstimate}>
            <Text style={styles.priceEstimateLabel}>{t.estimatedValue}:</Text>
            <Text style={styles.priceEstimateValue}>
              ${(parseFloat(weight) * selectedCargoData.pricePerKg).toFixed(2)}
            </Text>
          </View>
        )}

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
  selectButton: {
    height: 50,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  selectButtonText: {
    fontSize: 16,
    color: '#94a3b8',
  },
  selectButtonTextSelected: {
    color: '#0f172a',
    fontWeight: '600',
  },
  cargoList: {
    marginTop: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    maxHeight: 300,
  },
  cargoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cargoItemInfo: {
    flex: 1,
  },
  cargoItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  cargoItemPrice: {
    fontSize: 13,
    color: '#64748b',
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
  priceEstimate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    marginBottom: 20,
  },
  priceEstimateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  priceEstimateValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0284c7',
  },
  submitButton: {
    height: 50,
    backgroundColor: '#0284c7',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
});
