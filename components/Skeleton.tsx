import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, ViewStyle, useColorScheme } from 'react-native';
import { Colors } from '@/constants/colors';

interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Skeleton = ({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.searchBackground,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const SkeletonCompanyCard = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.cardHeader}>
        <Skeleton width={56} height={56} borderRadius={28} />
        <View style={styles.cardInfo}>
          <Skeleton width="60%" height={18} style={{ marginBottom: 8 }} />
          <Skeleton width="40%" height={14} />
        </View>
      </View>
      <View style={[styles.metricsRow, { backgroundColor: theme.tableHeader }]}>
        <View style={styles.metric}>
          <Skeleton width={60} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={40} height={12} />
        </View>
        <View style={styles.metric}>
          <Skeleton width={50} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={40} height={12} />
        </View>
        <View style={styles.metric}>
          <Skeleton width={50} height={16} style={{ marginBottom: 4 }} />
          <Skeleton width={40} height={12} />
        </View>
      </View>
    </View>
  );
};

export const SkeletonTableRow = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.tableRow, { backgroundColor: theme.cardBackground, borderBottomColor: theme.tableBorder }]}>
      <View style={styles.rankCell}>
        <Skeleton width={24} height={16} />
      </View>
      <View style={styles.companyCell}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={styles.companyCellInfo}>
          <Skeleton width="70%" height={14} style={{ marginBottom: 4 }} />
          <Skeleton width="50%" height={12} />
        </View>
      </View>
      <View style={styles.priceCell}>
        <Skeleton width={50} height={16} style={{ marginBottom: 4 }} />
        <Skeleton width={40} height={12} />
      </View>
      <View style={styles.deliveryCell}>
        <Skeleton width={30} height={16} />
      </View>
    </View>
  );
};

export const SkeletonShipmentCard = () => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.shipmentCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
      <View style={styles.shipmentHeader}>
        <Skeleton width={44} height={44} borderRadius={22} />
        <View style={styles.shipmentInfo}>
          <Skeleton width="60%" height={16} style={{ marginBottom: 6 }} />
          <Skeleton width="80%" height={12} />
        </View>
        <Skeleton width={80} height={24} borderRadius={8} />
      </View>
      <View style={[styles.shipmentBody, { backgroundColor: theme.tableHeader }]}>
        <View style={styles.shipmentDetail}>
          <Skeleton width={60} height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={50} height={16} />
        </View>
        <View style={styles.shipmentDetail}>
          <Skeleton width={60} height={14} style={{ marginBottom: 4 }} />
          <Skeleton width={70} height={16} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  cardInfo: {
    flex: 1,
  },
  metricsRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  rankCell: {
    width: 40,
    alignItems: 'center',
  },
  companyCell: {
    flex: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  companyCellInfo: {
    flex: 1,
  },
  priceCell: {
    flex: 1.5,
    alignItems: 'center',
  },
  deliveryCell: {
    flex: 1.5,
    alignItems: 'center',
  },
  shipmentCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  shipmentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  shipmentInfo: {
    flex: 1,
  },
  shipmentBody: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  shipmentDetail: {
    flex: 1,
    alignItems: 'center',
  },
});
