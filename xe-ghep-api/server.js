// filepath: /e:/LearnReactJS/GitCaNhan/LearReactJS/BaiTapThucHanh/api-server/app.js
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const port = process.env.PORT || 5000;

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(morgan("combined"));
app.use(bodyParser.json({ limit: '10kb' }));
app.use(cors());

// Rate limit for login endpoint
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau 15 phút.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', loginLimiter);

const itemRoutes = require('./routes/itemRoutes');
app.use('/car_info', itemRoutes);

const bookingRoutes = require('./routes/bookingRoutes');
app.use('/booking', bookingRoutes);

// Import routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const transportRoutes = require('./routes/transportRoutes');
app.use('/transport', transportRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});