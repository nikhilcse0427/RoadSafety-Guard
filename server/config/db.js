import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load env from server/.env or root .env depending on deploy
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.DATABASE_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not defined in environment");
    }

    await mongoose.connect(mongoUri, {
      // Recommended options for modern Mongoose
      // keepAlive helps on serverless providers
      keepAlive: true,
      connectTimeoutMS: 20000,
    });

    console.log('MongoDB connected successfully!!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // exit process with failure
  }
};

export default connectDB;
