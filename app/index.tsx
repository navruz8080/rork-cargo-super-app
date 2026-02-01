import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useUser } from '@/contexts/UserContext';

export default function Index() {
  const { isLoggedIn, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <ActivityIndicator size="large" color="#0284c7" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/(home)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
