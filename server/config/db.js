import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Always load env from server/.env regardless of cwd
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/road_safety_guard';

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    // Ensure at least one admin exists (configurable via env)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@roadsafety.com';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin_user';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      await User.create({
        username: adminUsername,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isVerified: true,
        profile: { firstName: 'Admin', lastName: 'User', department: 'Administration' }
      });
      console.log(`Initial admin created: ${adminEmail}`);
    }
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

export default connectDB;
