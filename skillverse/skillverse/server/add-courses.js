const mongoose = require('mongoose');
require('dotenv').config();

// Course model
const Course = require('./models/Course');
const User = require('./models/User');

// Update razorpayService.js to handle missing keys gracefully
const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    // Check if Razorpay keys are available
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      this.instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      this.isConfigured = true;
    } else {
      console.log('⚠️  Razorpay keys not configured. Payment features will be disabled.');
      this.isConfigured = false;
    }
  }

  // Create order
  async createOrder(amount, currency = 'INR', receipt, notes = {}) {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Razorpay not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file'
      };
    }

    try {
      const options = {
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
        receipt,
        notes
      };

      const order = await this.instance.orders.create(options);
      return {
        success: true,
        order,
        message: 'Order created successfully'
      };
    } catch (error) {
      console.error('Razorpay order creation error:', error);
      return {
        success: false,
        message: 'Failed to create order',
        error: error.message
      };
    }
  }

  // ... rest of the methods with similar checks
}

// Function to create instructor users first
async function createInstructors() {
  const instructors = [
    {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@skillverse.com',
      phone: '9876543210',
      password: 'password123',
      role: 'instructor'
    },
    {
      name: 'Dr. Michael Chen',
      email: 'michael.chen@skillverse.com',
      phone: '9876543211',
      password: 'password123',
      role: 'instructor'
    }
  ];

  const createdInstructors = [];
  for (const instructorData of instructors) {
    let instructor = await User.findOne({ email: instructorData.email });
    if (!instructor) {
      instructor = new User(instructorData);
      await instructor.save();
    }
    createdInstructors.push(instructor);
    console.log(`✅ Instructor: ${instructor.name} (${instructor._id})`);
  }
  return createdInstructors;
}

// Sample course data
async function getCoursesData(instructors) {
  return [
    {
      title: 'Interactive Circuit Learning',
      description: 'Learn electronics and circuit design through interactive VR/AR experiences.',
      detailedDescription: 'Master circuit design with VR/AR technology. This comprehensive course covers everything from basic circuit theory to advanced VR/AR applications. You will learn to design, analyze, and troubleshoot electronic circuits using cutting-edge virtual and augmented reality tools. Perfect for students, engineers, and electronics enthusiasts who want to take their learning to the next dimension.',
      instructor: instructors[0]._id, // Dr. Sarah Johnson
      category: 'Engineering',
      price: 2999,
      originalPrice: 3999,
      thumbnail: 'https://imgs.search.brave.com/fWCm-UAyq8xJL3ucjXlIpuT1wuK_GS4EiH3k9lLFXXQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY2hl/Zi5iYmNpLmNvLnVr/L2ltYWdlcy9pYy80/ODB4MjcwL3AwZjA4/bTZqLnBuZw/circuit-image.jpg', // Replace with your actual image URL
      images: ['https://imgs.search.brave.com/fWCm-UAyq8xJL3ucjXlIpuT1wuK_GS4EiH3k9lLFXXQ/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pY2hl/Zi5iYmNpLmNvLnVr/L2ltYWdlcy9pYy80/ODB4MjcwL3AwZjA4/bTZqLnBuZw/circuit-course.jpg'], // Replace with your actual image URL
      duration: 8, // 8 weeks in number
      level: 'Intermediate',
      language: 'English',
      tags: ['Electronics', 'VR', 'AR', 'Circuit Design', 'Interactive Learning'],
      requirements: ['Basic electronics knowledge', 'High school physics'],
      learningOutcomes: [
        'Design and analyze electronic circuits',
        'Use VR/AR tools for circuit simulation',
        'Troubleshoot circuit problems',
        'Build practical electronic projects'
      ],
      lessons: [
        {
          title: 'Introduction to Circuit Theory',
          description: 'Basic concepts of voltage, current, and resistance',
          content: 'In this lesson, you will learn the fundamental concepts of electrical circuits including voltage, current, resistance, and Ohm\'s law. We will explore how these concepts apply to real-world electronic devices and circuits.',
          duration: 45, // 45 minutes in number
          order: 1,
          isFree: true
        },
        {
          title: 'VR Circuit Builder',
          description: 'Interactive circuit building in virtual reality',
          content: 'Experience the future of circuit design with our VR Circuit Builder. Learn to assemble and test circuits in a fully immersive virtual environment. This hands-on approach makes complex concepts easy to understand.',
          duration: 60,
          order: 2,
          isFree: false
        },
        {
          title: 'AR Circuit Analysis',
          description: 'Analyze circuits using augmented reality',
          content: 'Use augmented reality to analyze and debug circuits in real-time. This lesson teaches you how to use AR tools to visualize current flow, voltage drops, and component behavior.',
          duration: 50,
          order: 3,
          isFree: false
        },
        {
          title: 'Practical Project: LED Circuit',
          description: 'Build a real LED circuit project',
          content: 'Apply your knowledge by building a practical LED circuit project. This lesson combines theory with hands-on practice, teaching you to design, build, and troubleshoot a working LED circuit.',
          duration: 90,
          order: 4,
          isFree: false
        }
      ],
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 3421,
      rating: 4.8, // Simple number instead of object
      ratingCount: 1247, // Separate field for count
    },
    {
      title: 'VR Medical Anatomy Learning',
      description: 'Explore human anatomy through immersive VR experiences.',
      detailedDescription: 'Master human anatomy with VR technology. This cutting-edge course uses virtual reality to provide an immersive learning experience for medical students, healthcare professionals, and anatomy enthusiasts. Explore the human body in 3D, understand complex anatomical relationships, and develop diagnostic skills through interactive VR modules.',
      instructor: instructors[1]._id, // Dr. Michael Chen
      category: 'Anatomy',
      price: 3999,
      originalPrice: 4999,
      thumbnail: 'https://imgs.search.brave.com/cxwAvVYr2Q2Ve8ak07h6YCXVMc364k4QR2P_xCXVoic/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTYw/NzA5NDkyMi92ZWN0/b3IvbHVuZ3MtaWxs/dXN0cmF0aW9uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1V/VVdkeU5GTl9wYWVf/WjRDemUwZk8xc2la/MmNMMW4tX3ZtNGJk/QnNCejRNPQ/medical-image.jpg', // Replace with your actual image URL
      images: ['https://imgs.search.brave.com/cxwAvVYr2Q2Ve8ak07h6YCXVMc364k4QR2P_xCXVoic/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTYw/NzA5NDkyMi92ZWN0/b3IvbHVuZ3MtaWxs/dXN0cmF0aW9uLmpw/Zz9zPTYxMng2MTIm/dz0wJms9MjAmYz1V/VVdkeU5GTl9wYWVf/WjRDemUwZk8xc2la/MmNMMW4tX3ZtNGJk/QnNCejRNPQ/medical-course.jpg'], // Replace with your actual image URL
      duration: 10, // 10 weeks in number
      level: 'Beginner',
      language: 'English',
      tags: ['Medical', 'VR', 'Anatomy', '3D Learning', 'Healthcare'],
      requirements: ['Basic biology knowledge', 'Interest in medical field'],
      learningOutcomes: [
        'Identify and understand human organ systems',
        'Use VR for medical education',
        'Analyze 3D anatomical models',
        'Apply knowledge to medical scenarios'
      ],
      lessons: [
        {
          title: 'Introduction to Human Anatomy',
          description: 'Overview of human body systems and organization',
          content: 'Begin your journey into human anatomy with a comprehensive overview of body systems and their organization. Learn about the major organ systems and how they work together to maintain life.',
          duration: 40,
          order: 1,
          isFree: true
        },
        {
          title: 'VR Lungs Exploration',
          description: 'Interactive 3D exploration of lung anatomy',
          content: 'Dive deep into the respiratory system with our VR Lungs Exploration module. Navigate through the bronchial tree, examine alveoli up close, and understand the mechanics of breathing in an immersive 3D environment.',
          duration: 75,
          order: 2,
          isFree: false
        },
        {
          title: 'Heart and Circulatory System',
          description: '3D heart model and blood flow simulation',
          content: 'Explore the cardiovascular system with detailed 3D models of the heart and blood vessels. Watch blood flow in real-time, understand cardiac cycles, and learn about common cardiovascular conditions.',
          duration: 65,
          order: 3,
          isFree: false
        },
        {
          title: 'Medical Case Studies',
          description: 'Apply anatomy knowledge to real medical cases',
          content: 'Test your knowledge with real medical case studies. Learn to apply anatomical knowledge to diagnose conditions, understand symptoms, and develop clinical reasoning skills.',
          duration: 80,
          order: 4,
          isFree: false
        }
      ],
      isPublished: true,
      isFeatured: true,
      enrollmentCount: 2156,
      rating: 4.9, // Simple number instead of object
      ratingCount: 892, // Separate field for count
    }
  ];
}

// Function to add courses
async function addCourses() {
  try {
    // Connect to database
    const mongoURI = process.env.MONGODB_URL || 'mongodb://localhost:27017/skillverse';    await mongoose.connect(mongoURI);
    console.log('✅ Connected to database');

    // Create instructors first
    console.log('👨‍🏫 Creating instructors...');
    const instructors = await createInstructors();

    // Get course data with instructor IDs
    const coursesData = await getCoursesData(instructors);

    // Clear existing courses (optional)
    await Course.deleteMany({});
    console.log('🧹 Cleared existing courses');

    // Add new courses
    for (const courseData of coursesData) {
      const course = new Course(courseData);
      await course.save();
      console.log(`✅ Added course: ${course.title}`);
    }

    console.log(`\n Successfully added ${coursesData.length} courses to database!`);
    
    // Verify courses were added
    const totalCourses = await Course.countDocuments();
    console.log(`📊 Total courses in database: ${totalCourses}`);

  } catch (error) {
    console.error('❌ Error adding courses:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
addCourses(); 