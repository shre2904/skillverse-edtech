const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('✅ Database connected successfully'))
  .catch(err => {
    console.error('❌ Database connection failed:', err);
    process.exit(1);
  });

// Simple test route
app.get('/', (req, res) => {
  res.json({ message: 'SkillVerse EdTech API is running!' });
});

// Simple courses route
app.get('/courses/featured', async (req, res) => {
  try {
    console.log('Fetching featured courses...');
    
    // For now, return sample data without database
    const sampleCourses = [
      {
        _id: '1',
        title: "Complete Web Development Bootcamp",
        description: "Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB",
        price: 299,
        originalPrice: 599,
        duration: 40,
        level: "Beginner",
        category: "Web Development",
        rating: { average: 4.8, count: 1250 },
        studentsCount: 1250,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
        isPublished: true,
        isFeatured: true
      },
      {
        _id: '2',
        title: "Advanced React Development",
        description: "Master advanced React concepts including hooks, context, performance optimization, and testing",
        price: 199,
        originalPrice: 399,
        duration: 25,
        level: "Intermediate",
        category: "Web Development",
        rating: { average: 4.9, count: 890 },
        studentsCount: 890,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
        isPublished: true,
        isFeatured: true
      }
    ];

    console.log(`Returning ${sampleCourses.length} featured courses`);
    
    res.json({
      success: true,
      data: sampleCourses
    });
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured courses',
      error: error.message
    });
  }
});

// Simple courses route
app.get('/courses', async (req, res) => {
  try {
    console.log('Fetching courses...');
    
    // For now, return sample data without database
    const sampleCourses = [
      {
        _id: '1',
        title: "Complete Web Development Bootcamp",
        description: "Master modern web development with HTML, CSS, JavaScript, React, Node.js, and MongoDB",
        price: 299,
        originalPrice: 599,
        duration: 40,
        level: "Beginner",
        category: "Web Development",
        rating: { average: 4.8, count: 1250 },
        studentsCount: 1250,
        thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500",
        isPublished: true,
        isFeatured: true
      },
      {
        _id: '2',
        title: "Advanced React Development",
        description: "Master advanced React concepts including hooks, context, performance optimization, and testing",
        price: 199,
        originalPrice: 399,
        duration: 25,
        level: "Intermediate",
        category: "Web Development",
        rating: { average: 4.9, count: 890 },
        studentsCount: 890,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500",
        isPublished: true,
        isFeatured: true
      }
    ];

    console.log(`Returning ${sampleCourses.length} courses`);
    
    res.json({
      success: true,
      data: sampleCourses,
      pagination: {
        page: 1,
        limit: 10,
        total: sampleCourses.length,
        pages: 1
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: error.message
    });
  }
});

// Simple auth routes
app.post('/auth/register', async (req, res) => {
  try {
    console.log('Registering user...');
    const { name, email, password, phone } = req.body;

    // For now, just return success without database
    const token = 'sample-jwt-token';
    
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: '1',
        name,
        email,
        phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    console.log('Logging in user...');
    const { email, password } = req.body;

    // For now, just return success without database
    const token = 'sample-jwt-token';
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: '1',
        name: 'Test User',
        email,
        phone: '+1234567890'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
