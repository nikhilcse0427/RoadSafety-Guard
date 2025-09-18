import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Always load env from server/.env regardless of cwd
dotenv.config({ path: new URL('../.env', import.meta.url).pathname });

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI || 'mongodb://127.0.0.1:27017/road_safety_guard';

    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message || err);
    process.exit(1);
  }
};

export default connectDB;
