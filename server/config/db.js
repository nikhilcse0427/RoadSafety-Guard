import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({
  path: '../.env'
}); // looks for .env in root

const connectDB = async () => {
  try {
    if (!process.env.DATABASE_URI) {
      throw new Error("DATABASE_URI not defined in .env");
    }

    const connection = await mongoose.connect(process.env.DATABASE_URI, {
    });

    console.log('MongoDB connected successfully!!');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // exit process with failure
  }
};

export default connectDB;
