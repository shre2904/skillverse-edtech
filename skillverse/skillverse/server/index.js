const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Connect to MongoDB
const { conmnect } = require('./config/database');
conmnect();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (avatars)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/users', require('./routes/user'));
app.use('/api/chatbot', require('./routes/chatbot'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'SkillVerse EdTech API is running!' });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// ✅ 404 handler – Express 5–compatible
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found ! check again' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
