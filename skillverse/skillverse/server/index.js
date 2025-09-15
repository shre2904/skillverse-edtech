const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import the Course model
const Course = require('./models/Course');

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

// Function to seed the database with courses
const seedCourses = async () => {
  try {
    // Check if courses already exist
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      console.log('✅ Courses already exist in database');
      return;
    }

    console.log(' Seeding database with courses...');

    const coursesToSeed = [
      {
        title: "Interactive Circuit Learning with VR/AR",
        description: "Master electronics through immersive circuit building, real-time simulation, and guided tutorials in virtual reality.",
        detailedDescription: "This comprehensive course combines traditional electronics education with cutting-edge VR/AR technology. Students will learn circuit theory, component identification, and hands-on building through immersive virtual environments.",
        price: 2999,
        originalPrice: 3999,
        duration: 2,
        level: "Intermediate",
        category: "Engineering",
        rating: { average: 4.9, count: 1250 },
        enrollmentCount: 1250,
        thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500&h=300&fit=crop&crop=center",
        isPublished: true,
        isFeatured: true,
        instructor: new mongoose.Types.ObjectId(), // Placeholder instructor ID
        features: [
          "Drag & Drop Circuit Building",
          "Real-time Circuit Simulation",
          "VR/AR Integration",
          "Interactive Component Library",
          "Step-by-step Tutorials",
          "Progress Tracking"
        ],
        learningOutcomes: [
          "Understand fundamental circuit theory",
          "Build complex circuits using VR/AR tools",
          "Analyze circuit behavior through simulation",
          "Master component identification and usage",
          "Apply knowledge to real-world projects"
        ],
        lessons: [
          {
            title: "Introduction to Circuit Theory",
            description: "Learn the basics of electrical circuits and components",
            content: "This lesson covers fundamental concepts of electrical circuits, including voltage, current, resistance, and Ohm's law.",
            duration: 15,
            order: 1,
            isFree: true
          },
          {
            title: "Interactive Circuit Building",
            description: "Build your first circuit using drag and drop interface",
            content: "Hands-on practice with our interactive circuit builder. Learn to connect components and understand circuit flow.",
            duration: 25,
            order: 2,
            isFree: false
          },
          {
            title: "Real-time Simulation",
            description: "Watch your circuit come to life with live simulation",
            content: "See how your circuits behave in real-time with our advanced simulation engine.",
            duration: 20,
            order: 3,
            isFree: false
          },
          {
            title: "VR Circuit Experience",
            description: "Immersive VR circuit building and testing",
            content: "Step into virtual reality to build and test circuits in a 3D environment.",
            duration: 30,
            order: 4,
            isFree: false
          },
          {
            title: "Advanced Components",
            description: "Explore transistors, capacitors, and complex circuits",
            content: "Learn about advanced electronic components and their applications in complex circuits.",
            duration: 30,
            order: 5,
            isFree: false
          }
        ],
        reviews: [
          {
            user: new mongoose.Types.ObjectId(),
            rating: 5,
            comment: "Amazing VR experience! The circuit building is so intuitive."
          },
          {
            user: new mongoose.Types.ObjectId(),
            rating: 5,
            comment: "Best way to learn electronics. The real-time simulation is incredible!"
          }
        ]
      },
      {
        title: "VR Lungs Anatomy Learning Module",
        description: "Explore human lung anatomy through interactive 3D models, guided instruction systems, and immersive VR experiences.",
        detailedDescription: "Dive deep into human respiratory anatomy with our cutting-edge VR learning module. Perfect for medical students, healthcare professionals, and anatomy enthusiasts.",
        price: 2499,
        originalPrice: 3299,
        duration: 2,
        level: "Intermediate",
        category: "Anatomy",
        rating: { average: 4.8, count: 890 },
        enrollmentCount: 890,
        thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop&crop=center",
        isPublished: true,
        isFeatured: true,
        instructor: new mongoose.Types.ObjectId(), // Placeholder instructor ID
        features: [
          "Interactive 3D Lung Models",
          "VR Anatomy Exploration",
          "Guided Learning Paths",
          "Real-time 3D Visualization",
          "Medical-grade Accuracy",
          "Progress Assessment"
        ],
        learningOutcomes: [
          "Master human lung anatomy",
          "Navigate 3D anatomical models",
          "Understand respiratory system function",
          "Apply knowledge in clinical settings",
          "Develop spatial understanding of anatomy"
        ],
        lessons: [
          {
            title: "Introduction to Lung Anatomy",
            description: "Learn the basic structure and function of human lungs",
            content: "Overview of lung structure, function, and importance in the respiratory system.",
            duration: 12,
            order: 1,
            isFree: true
          },
          {
            title: "3D Lung Model Exploration",
            description: "Interact with detailed 3D models of lung structures",
            content: "Explore detailed 3D models of lungs with interactive features and annotations.",
            duration: 18,
            order: 2,
            isFree: false
          },
          {
            title: "Bronchial Tree Visualization",
            description: "Explore the complex branching system of airways",
            content: "Learn about the bronchial tree structure and its role in air distribution.",
            duration: 15,
            order: 3,
            isFree: false
          },
          {
            title: "VR Anatomy Experience",
            description: "Immersive VR exploration of lung anatomy",
            content: "Step into VR to explore lung anatomy in a fully immersive 3D environment.",
            duration: 25,
            order: 4,
            isFree: false
          },
          {
            title: "Respiratory System Function",
            description: "Understand how breathing works in detail",
            content: "Learn about the mechanics of breathing and gas exchange in the lungs.",
            duration: 20,
            order: 5,
            isFree: false
          }
        ],
        reviews: [
          {
            user: new mongoose.Types.ObjectId(),
            rating: 5,
            comment: "Incredible detail in the 3D models. Perfect for medical students!"
          },
          {
            user: new mongoose.Types.ObjectId(),
            rating: 4,
            comment: "The VR experience makes learning anatomy so much more engaging."
          }
        ]
      }
    ];

    // Insert courses into database
    await Course.insertMany(coursesToSeed);
    console.log('✅ Database seeded successfully with courses');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  }
};

// Seed the database when server starts
seedCourses();

// Featured courses route
app.get('/courses/featured', async (req, res) => {
  try {
    console.log('Fetching featured courses...');
    
    const featuredCourses = await Course.find({ isFeatured: true, isPublished: true });
    
    console.log(`Returning ${featuredCourses.length} featured courses`);
    
    res.json({
      success: true,
      data: featuredCourses
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

// All courses route
app.get('/courses', async (req, res) => {
  try {
    console.log('Fetching courses...');
    
    const { page = 1, limit = 10, search, category, level, sort } = req.query;
    
    // Build filter object
    const filter = { isPublished: true };
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (level && level !== 'All') {
      filter.level = level;
    }
    
    // Build sort object
    let sortObj = {};
    switch (sort) {
      case 'price_asc':
        sortObj = { price: 1 };
        break;
      case 'price_desc':
        sortObj = { price: -1 };
        break;
      case 'rating':
        sortObj = { 'rating.average': -1 };
        break;
      case 'enrollment':
        sortObj = { enrollmentCount: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    const courses = await Course.find(filter)
      .sort(sortObj)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Course.countDocuments(filter);
    
    console.log(`Returning ${courses.length} courses out of ${total} total`);
    
    res.json({
      success: true,
      data: courses,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
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

// Get course by ID route
app.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching course with ID: ${id}`);
    
    const course = await Course.findById(id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      course: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching course',
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
  console.log(`🚀 Server running on port ${PORT}`);
});
