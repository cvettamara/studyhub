const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// server start
app.listen(5000, () => console.log('Server running on port 5000'));