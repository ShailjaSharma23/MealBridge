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
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mealbridge', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to MongoDB: ${error.message}`);
    console.warn(`[Database Note] Ensure MongoDB is running locally, or configure MONGODB_URI in backend/.env with your MongoDB Atlas connection string.`);
    return null;
  }
};

mongoose.connection.on('disconnected', () => {
  console.log('[Database] MongoDB connection disconnected.');
});

export default connectDB;
