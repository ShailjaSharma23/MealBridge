import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Match from '../models/Match.js';
import ImpactLog from '../models/ImpactLog.js';
import { users, impactData } from './seedData.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();

    console.log('[Seeder] Clearing old collections...');
    await User.deleteMany();
    await Donation.deleteMany();
    await Match.deleteMany();
    await ImpactLog.deleteMany();

    console.log('[Seeder] Inserting users (Donors, Shelters, Volunteers, Guests)...');
    const createdUsers = await User.insertMany(users);

    const bistro42 = createdUsers.find((u) => u.name === 'Bistro 42');
    const greenValley = createdUsers.find((u) => u.name === 'Green Valley Cafe');
    const cityBites = createdUsers.find((u) => u.name === 'City Bites');
    const freshBites = createdUsers.find((u) => u.name === 'Fresh Bites Bakery');
    const tasteHub = createdUsers.find((u) => u.name === 'Taste Hub');
    const healthyHouse = createdUsers.find((u) => u.name === 'Healthy House');
    const hopeShelter = createdUsers.find((u) => u.name === 'Hope Shelter');
    const alexVolunteer = createdUsers.find((u) => u.name === 'Alex Volunteer');

    console.log('[Seeder] Creating realistic food donation records matching UI screens...');
    const now = Date.now();

    const sampleDonations = [
      {
        donor: bistro42._id,
        donorName: 'Bistro 42',
        foodName: '15kg Cooked Rice & Curry',
        category: 'Cooked Meals',
        quantityKg: 15,
        servingsCount: 38,
        dietaryType: 'Veg Only',
        expiryHours: 1.25,
        expiresAt: new Date(now + 1.25 * 60 * 60 * 1000), // 1h 15m left
        pickupAddress: '123, Green Park, Sector 12, New Delhi - 110016',
        pickupCoordinates: { lat: 28.5582, lng: 77.2023 },
        status: 'matched',
        assignedShelter: hopeShelter._id,
        photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop',
        notes: 'Freshly packed in insulated thermal food containers.',
      },
      {
        donor: greenValley._id,
        donorName: 'Green Valley Cafe',
        foodName: '12kg Vegetable Pasta',
        category: 'Cooked Meals',
        quantityKg: 12,
        servingsCount: 30,
        dietaryType: 'Veg Only',
        expiryHours: 2.08,
        expiresAt: new Date(now + 2.08 * 60 * 60 * 1000), // 2h 05m left
        pickupAddress: 'Shop 14, Hauz Khas Market, New Delhi',
        pickupCoordinates: { lat: 28.5494, lng: 77.2001 },
        status: 'matched',
        assignedShelter: hopeShelter._id,
        photoUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop',
        notes: 'Prepared with fresh zucchini, bell peppers and tomato basil sauce.',
      },
      {
        donor: cityBites._id,
        donorName: 'City Bites',
        foodName: '10kg Dal & Rice',
        category: 'Cooked Meals',
        quantityKg: 10,
        servingsCount: 25,
        dietaryType: 'Veg Only',
        expiryHours: 2.78,
        expiresAt: new Date(now + 2.78 * 60 * 60 * 1000), // 2h 47m left
        pickupAddress: 'Block C, Connaught Place, New Delhi',
        pickupCoordinates: { lat: 28.6315, lng: 77.2167 },
        status: 'matched',
        assignedShelter: hopeShelter._id,
        photoUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
        notes: 'Nutritious yellow lentil curry with steamed basmati rice.',
      },
      {
        donor: freshBites._id,
        donorName: 'Fresh Bites Bakery',
        foodName: '8kg Veg Sandwiches',
        category: 'Bakery',
        quantityKg: 8,
        servingsCount: 20,
        dietaryType: 'Veg Only',
        expiryHours: 1.53,
        expiresAt: new Date(now + 1.53 * 60 * 60 * 1000), // 1h 32m left
        pickupAddress: 'Main Market, Karol Bagh, New Delhi',
        pickupCoordinates: { lat: 28.6521, lng: 77.1906 },
        status: 'matched',
        assignedShelter: hopeShelter._id,
        photoUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop',
        notes: 'Individually wrapped cucumber & cheese sandwiches.',
      },
      {
        donor: tasteHub._id,
        donorName: 'Taste Hub',
        foodName: '20kg Mixed Veg Curry',
        category: 'Cooked Meals',
        quantityKg: 20,
        servingsCount: 50,
        dietaryType: 'Veg Only',
        expiryHours: 3.17,
        expiresAt: new Date(now + 3.17 * 60 * 60 * 1000), // 3h 10m left
        pickupAddress: 'Sector 7, Rohini, New Delhi',
        pickupCoordinates: { lat: 28.7041, lng: 77.1025 },
        status: 'matched',
        assignedShelter: hopeShelter._id,
        photoUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&auto=format&fit=crop',
        notes: 'High-volume catering portion, packed securely.',
      },
      {
        donor: healthyHouse._id,
        donorName: 'Healthy House',
        foodName: '10kg Fresh Fruits',
        category: 'Produce',
        quantityKg: 10,
        servingsCount: 25,
        dietaryType: 'Veg Only',
        expiryHours: 2.35,
        expiresAt: new Date(now + 2.35 * 60 * 60 * 1000), // 2h 21m left
        pickupAddress: 'Community Center, Civil Lines, New Delhi',
        pickupCoordinates: { lat: 28.6814, lng: 77.2228 },
        status: 'matched',
        assignedShelter: hopeShelter._id,
        photoUrl: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop',
        notes: 'Assorted seasonal apples, bananas, and oranges.',
      },
    ];

    const createdDonations = await Donation.insertMany(sampleDonations);

    console.log('[Seeder] Creating Matches and Rescue Job #104 for Volunteer UI...');
    // Create Match for the primary donation (Bistro 42 -> Hope Shelter) matching Volunteer UI Rescue Job #104
    const primaryDonation = createdDonations[0];
    const match104 = await Match.create({
      jobCode: 'JOB-104',
      donation: primaryDonation._id,
      donor: bistro42._id,
      shelter: hopeShelter._id,
      volunteer: alexVolunteer._id,
      status: 'volunteer_assigned',
      distanceKm: 1.8,
      isUrgent: true,
      pickupLocation: {
        name: 'Bistro 42',
        address: '123, Green Park, Sector 12, New Delhi',
        lat: 28.5582,
        lng: 77.2023,
      },
      dropoffLocation: {
        name: 'Hope Shelter',
        address: 'Community Hall 4, Lajpat Nagar, New Delhi',
        lat: 28.5677,
        lng: 77.2433,
      },
    });

    // Link donation to this match
    primaryDonation.status = 'volunteer_assigned';
    primaryDonation.assignedVolunteer = alexVolunteer._id;
    primaryDonation.currentMatch = match104._id;
    primaryDonation.trackingTimestamps = {
      postedAt: new Date(now - 30 * 60 * 1000),
      matchedAt: new Date(now - 25 * 60 * 1000),
      volunteerAssignedAt: new Date(now - 10 * 60 * 1000),
      pickedUpAt: null,
      deliveredAt: null,
    };
    await primaryDonation.save();

    // Create matches for other donations
    for (let i = 1; i < createdDonations.length; i++) {
      const don = createdDonations[i];
      const dists = [2.4, 3.1, 2.7, 4.2, 1.5];
      await Match.create({
        donation: don._id,
        donor: don.donor,
        shelter: hopeShelter._id,
        status: 'offered',
        distanceKm: dists[i - 1],
        pickupLocation: {
          name: don.donorName,
          address: don.pickupAddress,
          lat: don.pickupCoordinates.lat,
          lng: don.pickupCoordinates.lng,
        },
        dropoffLocation: {
          name: 'Hope Shelter',
          address: 'Community Hall 4, Lajpat Nagar, New Delhi',
          lat: 28.5677,
          lng: 77.2433,
        },
      });
    }

    console.log('[Seeder] Inserting Impact Log analytics data...');
    await ImpactLog.create(impactData);

    console.log('----------------------------------------------------');
    console.log('✅ Demo data imported successfully!');
    console.log(`Users seeded:     ${createdUsers.length}`);
    console.log(`Donations seeded: ${createdDonations.length}`);
    console.log(`Matches seeded:   ${createdDonations.length} (including Rescue Job #104)`);
    console.log(`Impact Analytics: Initialized with June 2026 totals`);
    console.log('----------------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Donation.deleteMany();
    await Match.deleteMany();
    await ImpactLog.deleteMany();

    console.log('⚠️ All MealBridge collections cleared!');
    process.exit(0);
  } catch (error) {
    console.error(`[Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
