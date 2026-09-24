/**
 * Demo seed dataset matching the 6 approved UI mockup screens for MealBridge
 */

export const users = [
  // --- Donors ---
  {
    name: 'Bistro 42',
    email: 'bistro42@example.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 98111 22334',
    organizationType: 'Restaurant',
    isVerified: true,
    location: {
      address: '123, Green Park, Sector 12, New Delhi - 110016',
      coordinates: { lat: 28.5582, lng: 77.2023 },
    },
  },
  {
    name: 'Green Valley Cafe',
    email: 'greenvalley@example.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 98222 33445',
    organizationType: 'Cafeteria',
    isVerified: true,
    location: {
      address: 'Shop 14, Hauz Khas Market, New Delhi',
      coordinates: { lat: 28.5494, lng: 77.2001 },
    },
  },
  {
    name: 'City Bites',
    email: 'citybites@example.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 98333 44556',
    organizationType: 'Restaurant',
    isVerified: true,
    location: {
      address: 'Block C, Connaught Place, New Delhi',
      coordinates: { lat: 28.6315, lng: 77.2167 },
    },
  },
  {
    name: 'Fresh Bites Bakery',
    email: 'freshbites@example.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 98444 55667',
    organizationType: 'Bakery',
    isVerified: true,
    location: {
      address: 'Main Market, Karol Bagh, New Delhi',
      coordinates: { lat: 28.6521, lng: 77.1906 },
    },
  },
  {
    name: 'Taste Hub',
    email: 'tastehub@example.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 98555 66778',
    organizationType: 'Restaurant',
    isVerified: true,
    location: {
      address: 'Sector 7, Rohini, New Delhi',
      coordinates: { lat: 28.7041, lng: 77.1025 },
    },
  },
  {
    name: 'Healthy House',
    email: 'healthyhouse@example.com',
    password: 'password123',
    role: 'donor',
    phone: '+91 98666 77889',
    organizationType: 'Supermarket',
    isVerified: true,
    location: {
      address: 'Community Center, Civil Lines, New Delhi',
      coordinates: { lat: 28.6814, lng: 77.2228 },
    },
  },

  // --- Shelters ---
  {
    name: 'Hope Shelter',
    email: 'hopeshelter@example.com',
    password: 'password123',
    role: 'shelter',
    phone: '+91 98777 88990',
    organizationType: 'Shelter',
    isVerified: true,
    location: {
      address: 'Community Hall 4, Lajpat Nagar, New Delhi',
      coordinates: { lat: 28.5677, lng: 77.2433 },
    },
    shelterDetails: {
      capacityKg: 50,
      currentStorageUsedKg: 35,
      foodPreferences: ['Veg Only', 'Cooked Meals Accepted'],
      contactPerson: 'Sanjay Verma (Director)',
    },
  },
  {
    name: 'Sunshine Shelter',
    email: 'sunshine@example.com',
    password: 'password123',
    role: 'shelter',
    phone: '+91 98888 99001',
    organizationType: 'FoodBank',
    isVerified: true,
    location: {
      address: 'Near Old Delhi Railway Station, Chandni Chowk, New Delhi',
      coordinates: { lat: 28.6562, lng: 77.2304 },
    },
    shelterDetails: {
      capacityKg: 80,
      currentStorageUsedKg: 40,
      foodPreferences: ['Veg Only', 'Bakery Accepted', 'Cooked Meals Accepted'],
      contactPerson: 'Meera Patel',
    },
  },

  // --- Volunteer ---
  {
    name: 'Alex Volunteer',
    email: 'alex.volunteer@example.com',
    password: 'password123',
    role: 'volunteer',
    phone: '+91 98999 00112',
    organizationType: 'Individual',
    isVerified: true,
    location: {
      address: 'Sector 12, Green Park, New Delhi',
      coordinates: { lat: 28.559, lng: 77.204 },
    },
    volunteerDetails: {
      vehicleType: 'Scooter / Mini Van',
      completedRescuesCount: 12,
      totalKgDelivered: 186,
      communitiesServed: 8,
      certificatesEarned: 3,
      isAvailableNow: true,
    },
  },

  // --- Demo Guest ---
  {
    name: 'Guest Explorer',
    email: 'guest@example.com',
    password: 'password123',
    role: 'guest',
    phone: '+91 98000 11223',
    organizationType: 'Individual',
  },

  // --- Super Admin ---
  {
    name: 'MealBridge Super Admin',
    email: 'admin@gmail.com',
    password: 'password123',
    role: 'admin',
    phone: '+91 98999 88888',
    organizationType: 'Other',
    isVerified: true,
    location: {
      address: 'MealBridge Headquarters, Connaught Place, New Delhi',
      coordinates: { lat: 28.6315, lng: 77.2167 },
    },
  },
];

export const impactData = {
  month: 'June 2026',
  totalFoodRescuedKg: 12480,
  totalPeopleFed: 3240,
  totalSheltersSupported: 48,
  totalCo2SavedTons: 18.6,
  monthlyGrowthPercentage: {
    foodRescued: 24,
    peopleFed: 18,
    sheltersSupported: 12,
    co2Saved: 27,
  },
  categoryBreakdown: {
    cookedFood: { kg: 5242, percentage: 42 },
    bakery: { kg: 3494, percentage: 28 },
    produce: { kg: 2246, percentage: 18 },
    other: { kg: 1498, percentage: 12 },
  },
  growthTrend: [
    { month: 'Jan', foodRescuedKg: 5200 },
    { month: 'Feb', foodRescuedKg: 7800 },
    { month: 'Mar', foodRescuedKg: 9400 },
    { month: 'Apr', foodRescuedKg: 11200 },
    { month: 'May', foodRescuedKg: 13600 },
    { month: 'Jun', foodRescuedKg: 16800 },
  ],
  cityHeatmapStats: {
    activeLocations: 48,
    ongoingPickups: 23,
    nextPickupMinutes: 12,
    topActiveAreas: [
      { name: 'Central City', level: 'High' },
      { name: 'Green Park', level: 'High' },
      { name: 'Riverside', level: 'Medium' },
      { name: 'New Delhi', level: 'Medium' },
    ],
  },
};
