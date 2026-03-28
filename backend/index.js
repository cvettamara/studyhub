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

const forumRoutes = require('./routes/forum');
app.use('/api/forum', forumRoutes);

const marketplaceRoutes = require('./routes/marketplace');
app.use('/api/marketplace', marketplaceRoutes);

const eventsRoutes = require('./routes/events');
app.use('/api/events', eventsRoutes);

// server start
app.listen(5000, () => console.log('Server running on port 5000'));