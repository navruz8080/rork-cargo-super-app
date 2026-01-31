export type TransportType = 'air' | 'auto' | 'rail';

export interface CargoCompany {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  pricePerKg: number;
  avgDeliveryDays: number;
  reliabilityScore: number;
  transportTypes: TransportType[];
  isVerified: boolean;
  totalShipments: number;
}

export interface Warehouse {
  id: string;
  cargoId: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  workingHours: string;
  latitude: number;
  longitude: number;
}

export interface PriceRate {
  id: string;
  cargoId: string;
  category: string;
  pricePerKg: number;
  transportType: TransportType;
  minWeight?: number;
  estimatedDays: string;
}

export interface Review {
  id: string;
  cargoId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
  trackingNumber: string;
}

export interface Shipment {
  id: string;
  userId: string;
  cargoId: string;
  cargoName: string;
  trackingNumber: string;
  status: 'pending' | 'in_transit' | 'at_customs' | 'ready_for_pickup' | 'delivered';
  weight: number;
  description: string;
  estimatedDelivery: string;
  createdAt: string;
  warehouseAddress: string;
  pickupPoint?: string;
}

export const cargoCompanies: CargoCompany[] = [
  {
    id: '1',
    name: 'ExpressAsia Cargo',
    logo: '🚀',
    rating: 4.8,
    reviewCount: 2847,
    pricePerKg: 3.5,
    avgDeliveryDays: 12,
    reliabilityScore: 98,
    transportTypes: ['air', 'auto'],
    isVerified: true,
    totalShipments: 15420,
  },
  {
    id: '2',
    name: 'Silk Road Logistics',
    logo: '🛣️',
    rating: 4.6,
    reviewCount: 1923,
    pricePerKg: 2.8,
    avgDeliveryDays: 18,
    reliabilityScore: 95,
    transportTypes: ['auto', 'rail'],
    isVerified: true,
    totalShipments: 12350,
  },
  {
    id: '3',
    name: 'Dragon Express',
    logo: '🐉',
    rating: 4.9,
    reviewCount: 3521,
    pricePerKg: 4.2,
    avgDeliveryDays: 10,
    reliabilityScore: 99,
    transportTypes: ['air'],
    isVerified: true,
    totalShipments: 18750,
  },
  {
    id: '4',
    name: 'China-CIS Bridge',
    logo: '🌉',
    rating: 4.5,
    reviewCount: 1456,
    pricePerKg: 2.5,
    avgDeliveryDays: 22,
    reliabilityScore: 92,
    transportTypes: ['rail', 'auto'],
    isVerified: true,
    totalShipments: 9840,
  },
  {
    id: '5',
    name: 'FastTrack Cargo',
    logo: '⚡',
    rating: 4.7,
    reviewCount: 2103,
    pricePerKg: 3.8,
    avgDeliveryDays: 14,
    reliabilityScore: 96,
    transportTypes: ['air', 'auto'],
    isVerified: true,
    totalShipments: 13200,
  },
  {
    id: '6',
    name: 'EconoShip TJ',
    logo: '📦',
    rating: 4.3,
    reviewCount: 987,
    pricePerKg: 2.2,
    avgDeliveryDays: 25,
    reliabilityScore: 89,
    transportTypes: ['auto'],
    isVerified: false,
    totalShipments: 6420,
  },
];

export const warehouses: Warehouse[] = [
  {
    id: 'w1',
    cargoId: '1',
    name: 'Guangzhou Hub',
    address: 'No. 123, Tianhe District, Guangzhou, Guangdong',
    city: 'Guangzhou',
    phone: '+86 20 8888 9999',
    workingHours: '09:00 - 18:00 (Mon-Sat)',
    latitude: 23.1291,
    longitude: 113.2644,
  },
  {
    id: 'w2',
    cargoId: '1',
    name: 'Yiwu Warehouse',
    address: 'Yiwu International Trade City, Block A, Yiwu, Zhejiang',
    city: 'Yiwu',
    phone: '+86 579 8555 6666',
    workingHours: '08:30 - 19:00 (Daily)',
    latitude: 29.3069,
    longitude: 120.0752,
  },
  {
    id: 'w3',
    cargoId: '2',
    name: 'Urumqi Station',
    address: 'Industrial Park Zone B, Urumqi, Xinjiang',
    city: 'Urumqi',
    phone: '+86 991 7777 8888',
    workingHours: '09:00 - 17:00 (Mon-Fri)',
    latitude: 43.8256,
    longitude: 87.6168,
  },
  {
    id: 'w4',
    cargoId: '3',
    name: 'Shenzhen Airport Hub',
    address: 'Cargo Terminal 2, Shenzhen Bao\'an International Airport',
    city: 'Shenzhen',
    phone: '+86 755 2777 3333',
    workingHours: '24/7',
    latitude: 22.6393,
    longitude: 113.8108,
  },
];

export const priceRates: PriceRate[] = [
  {
    id: 'r1',
    cargoId: '1',
    category: 'Electronics',
    pricePerKg: 4.0,
    transportType: 'air',
    minWeight: 0.5,
    estimatedDays: '10-12 days',
  },
  {
    id: 'r2',
    cargoId: '1',
    category: 'Clothing',
    pricePerKg: 3.2,
    transportType: 'air',
    estimatedDays: '10-12 days',
  },
  {
    id: 'r3',
    cargoId: '1',
    category: 'General Goods',
    pricePerKg: 3.5,
    transportType: 'auto',
    estimatedDays: '15-18 days',
  },
  {
    id: 'r4',
    cargoId: '2',
    category: 'Electronics',
    pricePerKg: 3.2,
    transportType: 'auto',
    estimatedDays: '18-22 days',
  },
  {
    id: 'r5',
    cargoId: '2',
    category: 'Furniture',
    pricePerKg: 2.5,
    transportType: 'rail',
    minWeight: 10,
    estimatedDays: '25-30 days',
  },
  {
    id: 'r6',
    cargoId: '3',
    category: 'Electronics',
    pricePerKg: 4.5,
    transportType: 'air',
    estimatedDays: '8-10 days',
  },
  {
    id: 'r7',
    cargoId: '3',
    category: 'Documents',
    pricePerKg: 5.0,
    transportType: 'air',
    estimatedDays: '7-9 days',
  },
];

export const reviews: Review[] = [
  {
    id: 'rev1',
    cargoId: '1',
    userId: 'u1',
    userName: 'Farruh M.',
    rating: 5,
    comment: 'Excellent service! Package arrived in 11 days, well packed and no issues at customs.',
    date: '2024-01-15',
    isVerified: true,
    trackingNumber: 'EA1234567890TJ',
  },
  {
    id: 'rev2',
    cargoId: '1',
    userId: 'u2',
    userName: 'Zarina K.',
    rating: 4,
    comment: 'Good delivery time, but customer support could be more responsive.',
    date: '2024-01-10',
    isVerified: true,
    trackingNumber: 'EA9876543210TJ',
  },
  {
    id: 'rev3',
    cargoId: '3',
    userId: 'u3',
    userName: 'Alisher S.',
    rating: 5,
    comment: 'Best cargo company! Fast, reliable, and professional. Highly recommend!',
    date: '2024-01-20',
    isVerified: true,
    trackingNumber: 'DE5555666677TJ',
  },
];

export const mockShipments: Shipment[] = [
  {
    id: 's1',
    userId: 'current_user',
    cargoId: '1',
    cargoName: 'ExpressAsia Cargo',
    trackingNumber: 'EA2024010001TJ',
    status: 'in_transit',
    weight: 5.2,
    description: 'Electronics - Phone and accessories',
    estimatedDelivery: '2024-02-10',
    createdAt: '2024-01-28',
    warehouseAddress: 'Guangzhou Hub',
  },
  {
    id: 's2',
    userId: 'current_user',
    cargoId: '3',
    cargoName: 'Dragon Express',
    trackingNumber: 'DE2024010015TJ',
    status: 'ready_for_pickup',
    weight: 2.8,
    description: 'Clothing and shoes',
    estimatedDelivery: '2024-02-05',
    createdAt: '2024-01-25',
    warehouseAddress: 'Dushanbe Office',
    pickupPoint: 'Main St, Building 45',
  },
  {
    id: 's3',
    userId: 'current_user',
    cargoId: '2',
    cargoName: 'Silk Road Logistics',
    trackingNumber: 'SR2023120050TJ',
    status: 'delivered',
    weight: 12.5,
    description: 'Home appliances',
    estimatedDelivery: '2024-01-15',
    createdAt: '2023-12-20',
    warehouseAddress: 'Urumqi Station',
  },
];
