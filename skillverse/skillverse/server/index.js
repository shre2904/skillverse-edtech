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

// Course data with only Circuit and Medical modules
const coursesData = [
  {
    _id: 'circuit-101',
    title: "Interactive Circuit Learning with VR/AR",
    description: "Master electronics through immersive circuit building, real-time simulation, and guided tutorials in virtual reality.",
    price: 2999,
    originalPrice: 3999,
    duration: 120, // in minutes
    level: "Intermediate",
    category: "Engineering",
    rating: { average: 4.9, count: 1250 },
    studentsCount: 1250,
    enrollmentCount: 1250,
    thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=500",
    isPublished: true,
    isFeatured: true,
    instructor: {
      name: "Dr. Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100",
      bio: "Expert in electrical engineering with 15+ years of experience"
    },
    features: [
      "Drag & Drop Circuit Building",
      "Real-time Electrical Simulation", 
      "VR/AR Immersive Experience",
      "Interactive Component Library",
      "Progress Tracking & Analytics"
    ],
    learningOutcomes: [
      "Understand fundamental circuit theory and components",
      "Build and test circuits using interactive tools",
      "Master VR/AR circuit building techniques",
      "Analyze circuit behavior in real-time",
      "Apply knowledge to practical projects"
    ],
    lessons: [
      {
        _id: "lesson-1",
        title: "Introduction to Circuit Theory",
        description: "Learn the basics of electrical circuits and components",
        duration: 15,
        isFree: true
      },
      {
        _id: "lesson-2", 
        title: "Interactive Circuit Building",
        description: "Build your first circuit using drag and drop interface",
        duration: 25,
        isFree: false
      },
      {
        _id: "lesson-3",
        title: "Real-time Simulation",
        description: "Watch your circuit come to life with live simulation",
        duration: 20,
        isFree: false
      },
      {
        _id: "lesson-4",
        title: "VR Circuit Experience",
        description: "Immersive VR circuit building and testing",
        duration: 30,
        isFree: false
      },
      {
        _id: "lesson-5",
        title: "Advanced Components",
        description: "Explore transistors, capacitors, and complex circuits",
        duration: 30,
        isFree: false
      }
    ],
    requirements: [
      "Basic understanding of physics",
      "VR headset recommended (optional)",
      "Computer with modern browser",
      "No prior electronics experience required"
    ],
    reviews: [
      {
        _id: "review-1",
        user: {
          name: "Alex Chen",
          avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50"
        },
        rating: 5,
        comment: "Amazing VR experience! The circuit building is so intuitive."
      },
      {
        _id: "review-2", 
        user: {
          name: "Sarah Wilson",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50"
        },
        rating: 5,
        comment: "Best way to learn electronics. The real-time simulation is incredible!"
      }
    ]
  },
  {
    _id: 'medical-101',
    title: "VR Lungs Anatomy Learning Module",
    description: "Explore human lung anatomy through interactive 3D models, guided instruction systems, and immersive VR experiences.",
    price: 2499,
    originalPrice: 3299,
    duration: 90, // in minutes
    level: "Beginner",
    category: "Anatomy",
    rating: { average: 4.8, count: 890 },
    studentsCount: 890,
    enrollmentCount: 890,
    thumbnail: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500",
    isPublished: true,
    isFeatured: true,
    instructor: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100",
      bio: "Medical professional specializing in respiratory anatomy"
    },
    features: [
      "Interactive 3D Lung Models",
      "VR Immersive Experience",
      "Bronchial Tree Visualization",
      "Real-time Anatomy Exploration",
      "Guided Learning System"
    ],
    learningOutcomes: [
      "Understand lung anatomy and structure",
      "Navigate 3D lung models effectively",
      "Identify bronchial tree components",
      "Apply knowledge to medical scenarios",
      "Master VR anatomy exploration"
    ],
    lessons: [
      {
        _id: "lesson-1",
        title: "Introduction to Lung Anatomy",
        description: "Learn the basic structure and function of human lungs",
        duration: 12,
        isFree: true
      },
      {
        _id: "lesson-2",
        title: "3D Lung Model Exploration",
        description: "Interact with detailed 3D models of lung structures",
        duration: 18,
        isFree: false
      },
      {
        _id: "lesson-3",
        title: "Bronchial Tree Visualization",
        description: "Explore the complex branching system of airways",
        duration: 15,
        isFree: false
      },
      {
        _id: "lesson-4",
        title: "VR Anatomy Experience",
        description: "Immersive VR exploration of lung anatomy",
        duration: 25,
        isFree: false
      },
      {
        _id: "lesson-5",
        title: "Respiratory System Function",
        description: "Understand how breathing works in detail",
        duration: 20,
        isFree: false
      }
    ],
    requirements: [
      "Basic biology knowledge helpful",
      "VR headset recommended (optional)",
      "Computer with modern browser",
      "No prior medical experience required"
    ],
    reviews: [
      {
        _id: "review-1",
        user: {
          name: "Dr. Emily Rodriguez",
          avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=50"
        },
        rating: 5,
        comment: "Incredible detail in the 3D models. Perfect for medical students!"
      },
      {
        _id: "review-2",
        user: {
          name: "James Thompson",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50"
        },
        rating: 4,
        comment: "The VR experience makes learning anatomy so much more engaging."
      }
    ]
  }
];

// Featured courses route
app.get('/courses/featured', async (req, res) => {
  try {
    console.log('Fetching featured courses...');
    
    const featuredCourses = coursesData.filter(course => course.isFeatured);
    
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
    
    console.log(`Returning ${coursesData.length} courses`);
    
    res.json({
      success: true,
      data: coursesData,
      pagination: {
        page: 1,
        limit: 10,
        total: coursesData.length,
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

// Get course by ID route
app.get('/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Fetching course with ID: ${id}`);
    
    const course = coursesData.find(c => c._id === id);
    
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
  console.log(` Server running on port ${PORT}`);
});
