const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const skillRoutes = require('./routes/skills');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/skills', skillRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("✅ MongoDB Connected");
  app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
  });
}).catch(err => {
  console.error("MongoDB connection error:", err.message);
});
