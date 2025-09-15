const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import the Course model
const Course = require('./models/Course');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../client/build')));

// Serve course images specifically
app.use('/images/courses', express.static(path.join(__dirname, '../client/public/images/courses')));

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

// Function to update existing courses with correct image names
const updateCourseImages = async () => {
  try {
    console.log('🔄 Updating course images...');
    
    // Get the base URL for images
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://skillverse-backend-8j15.onrender.com' 
      : 'http://localhost:5000';
    
    // Update Circuit Module course
    await Course.updateOne(
      { title: "Interactive Circuit Learning with VR/AR" },
      { $set: { thumbnail: `${baseUrl}/images/courses/circuit img.jpg` } }
    );
    
    // Update Medical Module course
    await Course.updateOne(
      { title: "VR Lungs Anatomy Learning Module" },
      { $set: { thumbnail: `${baseUrl}/images/courses/lungs-illustration.jpg` } }
    );
    
    console.log('✅ Course images updated successfully');
  } catch (error) {
    console.error('❌ Error updating course images:', error);
  }
};

// Function to seed the database with courses
const seedCourses = async () => {
  try {
    // Check if courses already exist
    const existingCourses = await Course.countDocuments();
    if (existingCourses > 0) {
      console.log('✅ Courses already exist in database');
      // Update existing courses with correct image names
      await updateCourseImages();
      return;
    }

    console.log(' Seeding database with courses...');

    // Get the base URL for images
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://skillverse-backend-8j15.onrender.com' 
      : 'http://localhost:5000';

    const coursesToSeed = [
      {
        title: "Interactive Circuit Learning with VR/AR",
        description: "Master electronics through immersive circuit building, real-time simulation, and guided tutorials in virtual reality.",
        detailedDescription: "Experience the future of electronics education with our cutting-edge VR/AR circuit learning module. Build, test, and analyze circuits in an immersive 3D environment.",
        price: 2999,
        originalPrice: 3999,
        duration: 2,
        level: "Intermediate",
        category: "Engineering",
        rating: { average: 4.9, count: 1250 },
        enrollmentCount: 1250,
        thumbnail: `${baseUrl}/images/courses/circuit img.jpg`,
        isPublished: true,
        isFeatured: true,
        instructor: new mongoose.Types.ObjectId(),
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
        thumbnail: `${baseUrl}/images/courses/lungs-illustration.jpg`,
        isPublished: true,
        isFeatured: true,
        instructor: new mongoose.Types.ObjectId(),
        features: [
          "Interactive 3D Lung Models",
          "VR Anatomy Exploration",
          "Guided Learning Paths",
          "Real-time 3D Visualization",
          "Anatomical Structure Labeling",
          "Interactive Quizzes"
        ],
        learningOutcomes: [
          "Identify all major lung structures and their functions",
          "Understand respiratory system physiology",
          "Navigate 3D anatomical models confidently",
          "Apply knowledge in clinical scenarios",
          "Master respiratory system terminology"
        ],
        lessons: [
          {
            title: "Introduction to Respiratory System",
            description: "Overview of the human respiratory system and its importance",
            content: "Learn about the structure and function of the respiratory system, including the role of lungs in gas exchange.",
            duration: 20,
            order: 1,
            isFree: true
          },
          {
            title: "3D Lung Anatomy Exploration",
            description: "Interactive exploration of lung structures in 3D",
            content: "Navigate through detailed 3D models of the lungs, identifying key anatomical structures and their relationships.",
            duration: 30,
            order: 2,
            isFree: false
          },
          {
            title: "VR Anatomy Lab",
            description: "Immersive VR experience for hands-on anatomy learning",
            content: "Step into a virtual anatomy lab to explore lung structures in an immersive 3D environment.",
            duration: 25,
            order: 3,
            isFree: false
          },
          {
            title: "Respiratory Physiology",
            description: "Understanding how the lungs function in breathing",
            content: "Learn about the mechanics of breathing, gas exchange, and respiratory physiology.",
            duration: 20,
            order: 4,
            isFree: false
          },
          {
            title: "Clinical Applications",
            description: "Applying anatomical knowledge to clinical scenarios",
            content: "Explore how understanding lung anatomy applies to medical diagnosis and treatment.",
            duration: 25,
            order: 5,
            isFree: false
          }
        ],
        reviews: [
          {
            user: new mongoose.Types.ObjectId(),
            rating: 5,
            comment: "Incredible VR experience! The 3D models are so detailed and realistic."
          },
          {
            user: new mongoose.Types.ObjectId(),
            rating: 4,
            comment: "Great learning tool for medical students. The guided instruction is very helpful."
          }
        ]
      }
    ];

    await Course.insertMany(coursesToSeed);
    console.log('✅ Courses seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  }
};

// Seed courses on startup
seedCourses();

// API Routes
app.get('/api/courses/featured', async (req, res) => {
  try {
    console.log('Fetching featured courses...');
    const featuredCourses = await Course.find({ isFeatured: true, isPublished: true });
    console.log(`Found ${featuredCourses.length} featured courses`);
    res.json({
      success: true,
      data: featuredCourses
    });
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured courses',
      error: error.message
    });
  }
});

app.get('/api/courses', async (req, res) => {
  try {
    const { page = 1, limit = 10, category, level, search } = req.query;
    const query = { isPublished: true };
    
    if (category) query.category = category;
    if (level) query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      success: true,
      data: courses,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch courses',
      error: error.message
    });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    res.json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch course',
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

// Catch all handler: send back React's index.html file for any non-API routes
app.get((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
