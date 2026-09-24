import mongoose from 'mongoose';
import dns from 'dns';

// Fix Node.js Windows DNS SRV lookup issue with MongoDB Atlas
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore if custom DNS not permitted
}

/**
 * Connect to MongoDB using the MONGODB_URI environment variable.
 * Implements clean error logging and reconnect event listeners.
 */
const ATLAS_URI = 'mongodb+srv://YASHBHATT:Yash123456@cluster0.c7bb0ee.mongodb.net/mealbridge?retryWrites=true&w=majority';

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || ATLAS_URI;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Primary connection failed: ${error.message}. Retrying...`);
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/mealbridge', {
        serverSelectionTimeoutMS: 3000,
      });
      console.log(`[Database] Connected to local fallback MongoDB`);
      return conn;
    } catch (localErr) {
      console.warn(`[Database Error] Could not connect to local or Atlas MongoDB: ${localErr.message}`);
      return null;
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[Database] MongoDB connection disconnected.');
});

export default connectDB;
