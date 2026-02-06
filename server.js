const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// API routes - MUST come before static (so /api/* is handled correctly)
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// 404 for unknown API paths (return JSON)
app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found' }));

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
