import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

// Route imports
import authRoutes from "./routes/auth.js";
import accidentRoutes from "./routes/accidents.js";
import analyticsRoutes from "./routes/analytics.js";
import adminRoutes from "./routes/admin.js";

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : undefined;

const corsOptions = {
  origin: allowedOrigins || true,
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accidents", accidentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// MongoDB connection
connectDB();

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Road Safety Guard API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
