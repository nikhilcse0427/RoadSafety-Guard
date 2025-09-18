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

// Allowed origins for CORS
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map(s => s.trim())
  : [
    "http://localhost:3000",
    "https://road-safety-guard-rcxx.vercel.app",
    process.env.FRONTEND_URL
  ].filter(Boolean);
connectDB();

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg = `CORS policy: Access denied from origin ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  optionsSuccessStatus: 200,
  preflightContinue: false
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/accidents", accidentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);


// Basic test routes
app.get("/", (req, res) => {
  res.json({ message: "Road Safety Guard API is running!" });
});

app.get("/api", (req, res) => {
  res.json({ message: "Road Safety Guard API is running!" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
