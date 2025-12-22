const express = require('express');
const cookieParser = require('cookie-parser'); 
const authRoutes = require('./routes/auth.routes'); 
const foodRoutes = require('./routes/food.routes');
const foodPartnerRoutes = require('./routes/food-partner.routes');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ["http://localhost:5173"];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser()); //middleware to parse cookies
app.use(express.json());  //middleware- data in req.body to make it readable

// serve uploads saved locally (used when ImageKit not configured)
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/food-partner', foodPartnerRoutes);

module .exports = app;