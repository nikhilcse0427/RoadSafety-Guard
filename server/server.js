const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration (supports comma-separated origins in CORS_ORIGIN)
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : undefined; // undefined => reflect request origin (development)

const corsOptions = {
  origin: allowedOrigins || true,
  credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/accidents', require('./routes/accidents'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/admin', require('./routes/admin'));

// MongoDB connection
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Road Safety Guard API is running!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
