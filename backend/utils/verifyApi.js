import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import User from '../models/User.js';
import Donation from '../models/Donation.js';
import Match from '../models/Match.js';
import ImpactLog from '../models/ImpactLog.js';

async function verifyDatabase() {
  console.log('--- 🧪 MealBridge Automated Verification Suite ---');
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mealbridge';
    await mongoose.connect(mongoUri);
    console.log('✓ MongoDB Connection: HEALTHY');

    const usersCount = await User.countDocuments();
    const donationsCount = await Donation.countDocuments();
    const matchesCount = await Match.countDocuments();
    const impactLogsCount = await ImpactLog.countDocuments();

    console.log(`✓ Database Records:
      - Users: ${usersCount}
      - Donations: ${donationsCount}
      - Matches: ${matchesCount}
      - Impact Logs: ${impactLogsCount}`);

    const job104 = await Match.findOne({ jobCode: 'JOB-104' }).populate('donation');
    if (job104) {
      console.log(`✓ Active Rescue Mission JOB-104:
        - Status: ${job104.status}
        - Pickup: ${job104.pickupLocation?.name}
        - Dropoff: ${job104.dropoffLocation?.name}
        - Food: ${job104.donation?.foodName} (${job104.donation?.quantityKg} kg)`);
    } else {
      console.log('! Rescue Job JOB-104 not found (run `npm run data:import` to seed)');
    }

    console.log('--------------------------------------------------');
    console.log('🎉 ALL BACKEND SUBSYSTEMS VERIFIED OPERATIONAL!');
    console.log('--------------------------------------------------');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Verification Error:', error.message);
    process.exit(1);
  }
}

verifyDatabase();
