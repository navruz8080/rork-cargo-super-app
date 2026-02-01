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
  chineseAddress?: string; // Chinese address for 1688/Taobao orders
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
  codAmount?: number; // Cash on Delivery amount in TJS
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
    name: 'Guangzhou Tianhe Hub',
    address: 'Building 15, Tianhe Software Park, 520 Tianhe Bei Road, Tianhe District',
    city: 'Guangzhou',
    phone: '+86 20 3878 5566',
    workingHours: '09:00 - 18:00 (Mon-Sat)',
    latitude: 23.1291,
    longitude: 113.2644,
    chineseAddress: '广东省广州市天河区天河北路520号天河软件园15栋 ExpressAsia仓库',
  },
  {
    id: 'w2',
    cargoId: '1',
    name: 'Yiwu Trade Center',
    address: 'Gate 3, Building H1-2, Yiwu International Trade City, Chouzhou North Road',
    city: 'Yiwu',
    phone: '+86 579 8520 1688',
    workingHours: '08:30 - 19:00 (Daily)',
    latitude: 29.3069,
    longitude: 120.0752,
    chineseAddress: '浙江省义乌市稠州北路国际商贸城H1-2区3号门 ExpressAsia仓库',
  },
  {
    id: 'w3',
    cargoId: '2',
    name: 'Urumqi Logistics Base',
    address: 'Warehouse Complex A7, Midong Industrial Park, Urumqi Economic Zone',
    city: 'Urumqi',
    phone: '+86 991 3856 7890',
    workingHours: '09:00 - 17:00 (Mon-Fri)',
    latitude: 43.8256,
    longitude: 87.6168,
    chineseAddress: '新疆乌鲁木齐市米东工业园区物流园A7号仓库 丝绸之路物流',
  },
  {
    id: 'w4',
    cargoId: '3',
    name: 'Shenzhen Air Cargo Hub',
    address: 'International Cargo Terminal, Gate 5, Shenzhen Bao\'an International Airport',
    city: 'Shenzhen',
    phone: '+86 755 2345 8888',
    workingHours: '24/7',
    latitude: 22.6393,
    longitude: 113.8108,
    chineseAddress: '广东省深圳市宝安国际机场国际货运站5号门 Dragon Express',
  },
  {
    id: 'w5',
    cargoId: '2',
    name: 'Guangzhou Baiyun Warehouse',
    address: 'Zone C, Baiyun District Logistics Park, 1258 Guanghua Road',
    city: 'Guangzhou',
    phone: '+86 20 8666 1234',
    workingHours: '08:00 - 20:00 (Daily)',
    latitude: 23.1867,
    longitude: 113.2989,
    chineseAddress: '广东省广州市白云区光华路1258号物流园C区 丝绸之路物流',
  },
  {
    id: 'w6',
    cargoId: '5',
    name: 'Yiwu Futian Market Hub',
    address: 'District 2, Floor 1, Yiwu Futian Market, Chengzhong Road',
    city: 'Yiwu',
    phone: '+86 579 8539 9999',
    workingHours: '08:00 - 18:00 (Mon-Sat)',
    latitude: 29.3141,
    longitude: 120.0689,
    chineseAddress: '浙江省义乌市城中路福田市场2区1楼 FastTrack仓库',
  },
];

export const priceRates: PriceRate[] = [
  {
    id: 'r1',
    cargoId: '1',
    category: 'Электроника (таможенная очистка включена)',
    pricePerKg: 4.0,
    transportType: 'air',
    minWeight: 0.5,
    estimatedDays: '10-12 дней',
  },
  {
    id: 'r2',
    cargoId: '1',
    category: 'Одежда и текстиль (бесплатная упаковка)',
    pricePerKg: 3.2,
    transportType: 'air',
    estimatedDays: '10-12 дней',
  },
  {
    id: 'r3',
    cargoId: '1',
    category: 'Общие товары (страховка груза 2%)',
    pricePerKg: 3.5,
    transportType: 'auto',
    estimatedDays: '15-18 дней',
  },
  {
    id: 'r4',
    cargoId: '2',
    category: 'Электроника (дополнительная защита)',
    pricePerKg: 3.2,
    transportType: 'auto',
    estimatedDays: '18-22 дня',
  },
  {
    id: 'r5',
    cargoId: '2',
    category: 'Мебель и крупногабарит (от 10 кг)',
    pricePerKg: 2.5,
    transportType: 'rail',
    minWeight: 10,
    estimatedDays: '25-30 дней',
  },
  {
    id: 'r6',
    cargoId: '3',
    category: 'Электроника экспресс (приоритет)',
    pricePerKg: 4.5,
    transportType: 'air',
    estimatedDays: '8-10 дней',
  },
  {
    id: 'r7',
    cargoId: '3',
    category: 'Документы (срочная доставка)',
    pricePerKg: 5.0,
    transportType: 'air',
    estimatedDays: '7-9 дней',
  },
  {
    id: 'r8',
    cargoId: '4',
    category: 'Строительные материалы (контейнер)',
    pricePerKg: 2.0,
    transportType: 'rail',
    minWeight: 50,
    estimatedDays: '30-35 дней',
  },
  {
    id: 'r9',
    cargoId: '5',
    category: 'Косметика и парфюмерия',
    pricePerKg: 3.8,
    transportType: 'air',
    minWeight: 1,
    estimatedDays: '12-14 дней',
  },
  {
    id: 'r10',
    cargoId: '5',
    category: 'Игрушки и товары для детей',
    pricePerKg: 3.3,
    transportType: 'auto',
    estimatedDays: '16-20 дней',
  },
];

export const reviews: Review[] = [
  {
    id: 'rev1',
    cargoId: '1',
    userId: 'u1',
    userName: 'Фаррух М.',
    rating: 5,
    comment: 'Отличный сервис! Посылка прибыла за 11 дней, хорошо упакована, никаких проблем на таможне. Буду пользоваться ещё!',
    date: '2024-01-15',
    isVerified: true,
    trackingNumber: 'EA1234567890TJ',
  },
  {
    id: 'rev2',
    cargoId: '1',
    userId: 'u2',
    userName: 'Зарина К.',
    rating: 4,
    comment: 'Хорошее время доставки, цены адекватные. Служба поддержки могла бы отвечать быстрее, но в целом доволен.',
    date: '2024-01-10',
    isVerified: true,
    trackingNumber: 'EA9876543210TJ',
  },
  {
    id: 'rev3',
    cargoId: '3',
    userId: 'u3',
    userName: 'Алишер С.',
    rating: 5,
    comment: 'Лучшая карго компания! Быстрая, надёжная и профессиональная. Отслеживание работает отлично. Очень рекомендую!',
    date: '2024-01-20',
    isVerified: true,
    trackingNumber: 'DE5555666677TJ',
  },
  {
    id: 'rev4',
    cargoId: '2',
    userId: 'u4',
    userName: 'Дилшод Р.',
    rating: 4,
    comment: 'Недорого и качественно. Доставка заняла 19 дней, что в пределах обещанного срока. Упаковка надёжная.',
    date: '2024-01-18',
    isVerified: true,
    trackingNumber: 'SR2024010088TJ',
  },
  {
    id: 'rev5',
    cargoId: '5',
    userId: 'u5',
    userName: 'Нигина Х.',
    rating: 5,
    comment: 'Заказывала косметику, всё пришло в целости. Менеджеры помогли с оформлением на складе в Иу. Спасибо!',
    date: '2024-01-22',
    isVerified: true,
    trackingNumber: 'FT2024010120TJ',
  },
  {
    id: 'rev6',
    cargoId: '3',
    userId: 'u6',
    userName: 'Рустам Т.',
    rating: 5,
    comment: 'Экспресс доставка оправдала ожидания - 9 дней! Дорого, но когда срочно нужно - это лучший вариант.',
    date: '2024-01-12',
    isVerified: true,
    trackingNumber: 'DE2024010055TJ',
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
    description: 'Электроника - смартфон и аксессуары',
    estimatedDelivery: '2024-02-10',
    createdAt: '2024-01-28',
    warehouseAddress: 'Guangzhou Tianhe Hub',
    codAmount: 204.75, // 5.2 kg * 3.5 USD * 11.25 TJS
  },
  {
    id: 's2',
    userId: 'current_user',
    cargoId: '3',
    cargoName: 'Dragon Express',
    trackingNumber: 'DE2024010015TJ',
    status: 'ready_for_pickup',
    weight: 2.8,
    description: 'Одежда и обувь',
    estimatedDelivery: '2024-02-05',
    createdAt: '2024-01-25',
    warehouseAddress: 'Офис в Душанбе',
    pickupPoint: 'ул. Рудаки 45, здание 12, офис Drop Logistics',
    codAmount: 110.25, // 2.8 kg * 3.5 USD * 11.25 TJS
  },
  {
    id: 's3',
    userId: 'current_user',
    cargoId: '2',
    cargoName: 'Silk Road Logistics',
    trackingNumber: 'SR2023120050TJ',
    status: 'delivered',
    weight: 12.5,
    description: 'Бытовая техника',
    estimatedDelivery: '2024-01-15',
    createdAt: '2023-12-20',
    warehouseAddress: 'Urumqi Logistics Base',
    pickupPoint: 'г. Худжанд, проспект Ленина 108, склад №3',
    codAmount: 492.19, // 12.5 kg * 3.5 USD * 11.25 TJS
  },
];
