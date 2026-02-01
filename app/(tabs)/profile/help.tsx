import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from 'react-native';
import { Phone, Mail, MessageCircle, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

export default function HelpScreen() {
  const { t } = useLanguage();

  const faqItems = [
    {
      question: t.howToOrder,
      answer: t.howToOrderDesc,
    },
    {
      question: t.trackingHelp,
      answer: t.trackingHelpDesc,
    },
    {
      question: t.paymentHelp,
      answer: t.paymentHelpDesc,
    },
    {
      question: t.customsHelp,
      answer: t.customsHelpDesc,
    },
  ];

  const handleCall = () => {
    Linking.openURL('tel:+992927778888');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@droplogistics.tj');
  };

  const handleWhatsApp = () => {
    const url = 'whatsapp://send?phone=+992927778888&text=Hello, I need help with Drop Logistics';
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
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Contact Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.contactUs}</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.contactItem} onPress={handleCall}>
            <View style={styles.contactIconContainer}>
              <Phone color="#0284c7" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{t.callUs}</Text>
              <Text style={styles.contactValue}>+992 92 777 8888</Text>
            </View>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.contactItem} onPress={handleEmail}>
            <View style={styles.contactIconContainer}>
              <Mail color="#0284c7" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{t.emailUs}</Text>
              <Text style={styles.contactValue}>support@droplogistics.tj</Text>
            </View>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.contactItem} onPress={handleWhatsApp}>
            <View style={styles.contactIconContainer}>
              <MessageCircle color="#25D366" size={24} />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>{t.whatsappUs}</Text>
              <Text style={styles.contactValue}>+992 92 777 8888</Text>
            </View>
            <ChevronRight color="#94a3b8" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* FAQ Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.faq}</Text>
        {faqItems.map((item, index) => (
          <View key={index} style={styles.faqCard}>
            <Text style={styles.faqQuestion}>{item.question}</Text>
            <Text style={styles.faqAnswer}>{item.answer}</Text>
          </View>
        ))}
      </View>

      {/* Working Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.workingHours}</Text>
        <View style={styles.card}>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday - Friday</Text>
            <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Saturday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 4:00 PM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>Closed</Text>
          </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 13,
    color: '#64748b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  faqCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  faqAnswer: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  hoursDay: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
  },
  hoursTime: {
    fontSize: 15,
    color: '#64748b',
  },
});
