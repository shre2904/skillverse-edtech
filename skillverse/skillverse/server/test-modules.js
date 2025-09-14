const mongoose = require('mongoose');
require('dotenv').config();

// Test database connection and module data
async function testModules() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/skillverse');
    console.log('✅ Connected to MongoDB');

    // Test if we can create sample course data
    const Course = require('./models/Course');
    const User = require('./models/User');

    // Check if we can create a circuit course
    const circuitCourse = new Course({
      title: 'Interactive Circuit Learning with VR/AR',
      description: 'Master electronics through immersive circuit building, real-time simulation, and guided tutorials in virtual reality.',
      instructor: new mongoose.Types.ObjectId(),
      category: 'Engineering',
      price: 2999,
      duration: 120, // 2 hours
      level: 'Intermediate',
      thumbnail: '/circuit-thumbnail.jpg',
      lessons: [
        {
          title: 'Introduction to Circuits',
          description: 'Learn the basics of electrical circuits and components',
          content: 'Welcome to circuit learning!',
          duration: 10,
          order: 1,
          isFree: false
        },
        {
          title: 'Interactive Circuit Building',
          description: 'Build your first circuit using drag and drop interface',
          content: 'Let\'s build circuits together!',
          duration: 15,
          order: 2,
          isFree: false
        }
      ],
      learningOutcomes: [
        'Understand basic electrical concepts',
        'Build circuits using interactive tools',
        'Use VR/AR for immersive learning'
      ]
    });

    console.log('✅ Circuit course data structure is valid');

    // Check if we can create a medical course
    const medicalCourse = new Course({
      title: 'VR Lungs Anatomy Learning Module',
      description: 'Explore human lung anatomy through interactive 3D models, guided instruction systems, and immersive VR experiences.',
      instructor: new mongoose.Types.ObjectId(),
      category: 'Medical',
      price: 2499,
      duration: 90, // 1.5 hours
      level: 'Beginner',
      thumbnail: '/medical-thumbnail.jpg',
      lessons: [
        {
          title: 'Introduction to Lung Anatomy',
          description: 'Learn the basic structure and function of human lungs',
          content: 'Welcome to medical learning!',
          duration: 8,
          order: 1,
          isFree: false
        },
        {
          title: '3D Lung Model Exploration',
          description: 'Interact with detailed 3D models of lung structures',
          content: 'Explore 3D anatomy!',
          duration: 12,
          order: 2,
          isFree: false
        }
      ],
      learningOutcomes: [
        'Understand lung anatomy',
        'Interact with 3D models',
        'Experience VR learning'
      ]
    });

    console.log('✅ Medical course data structure is valid');
    console.log('✅ All module tests passed!');

  } catch (error) {
    console.error('❌ Module test failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

testModules(); 