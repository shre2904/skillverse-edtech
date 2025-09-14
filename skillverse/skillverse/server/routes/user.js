const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Course = require('../models/Course');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.course', 'title thumbnail category price')
      .populate('paymentHistory', 'amount status createdAt course')
      .select('-password -emailOtp -phoneOtp -otpExpires');

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  protect,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('avatar')
    .optional()
    .isURL()
    .withMessage('Avatar must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const allowedUpdates = ['name', 'avatar'];
    const updates = {};
    
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password -emailOtp -phoneOtp -otpExpires');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// @route   GET /api/users/enrolled-courses
// @desc    Get user's enrolled courses with progress
// @access  Private
router.get('/enrolled-courses', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.course',
        select: 'title thumbnail category duration level instructor',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      })
      .select('enrolledCourses');

    const enrolledCourses = user.enrolledCourses.map(enrollment => ({
      course: enrollment.course,
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons,
      enrolledAt: enrollment.enrolledAt
    }));

    res.json({
      success: true,
      enrolledCourses
    });
  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses'
    });
  }
});

// @route   PUT /api/users/enrolled-courses/:courseId/progress
// @desc    Update course progress
// @access  Private
router.put('/enrolled-courses/:courseId/progress', [
  protect,
  body('progress')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('completedLessonId')
    .optional()
    .isMongoId()
    .withMessage('Valid lesson ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { courseId } = req.params;
    const { progress, completedLessonId } = req.body;

    const user = await User.findById(req.user._id);
    const enrollment = user.enrolledCourses.find(
      enrollment => enrollment.course.toString() === courseId
    );

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Course enrollment not found'
      });
    }

    // Update progress
    enrollment.progress = progress;

    // Add completed lesson if provided
    if (completedLessonId && !enrollment.completedLessons.includes(completedLessonId)) {
      enrollment.completedLessons.push(completedLessonId);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: enrollment.progress,
      completedLessons: enrollment.completedLessons
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress'
    });
  }
});

// @route   GET /api/users/analytics
// @desc    Get user learning analytics
// @access  Private
router.get('/analytics', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('enrolledCourses.course', 'title category')
      .select('enrolledCourses createdAt');

    const totalEnrolled = user.enrolledCourses.length;
    const totalProgress = user.enrolledCourses.reduce(
      (sum, enrollment) => sum + enrollment.progress, 0
    );
    const averageProgress = totalEnrolled > 0 ? totalProgress / totalEnrolled : 0;

    // Course completion stats
    const completedCourses = user.enrolledCourses.filter(
      enrollment => enrollment.progress === 100
    ).length;

    // Category distribution
    const categoryStats = {};
    user.enrolledCourses.forEach(enrollment => {
      const category = enrollment.course.category;
      categoryStats[category] = (categoryStats[category] || 0) + 1;
    });

    // Monthly enrollment trend
    const monthlyEnrollments = {};
    user.enrolledCourses.forEach(enrollment => {
      const month = enrollment.enrolledAt.toISOString().substr(0, 7);
      monthlyEnrollments[month] = (monthlyEnrollments[month] || 0) + 1;
    });

    res.json({
      success: true,
      analytics: {
        totalEnrolled,
        averageProgress: Math.round(averageProgress * 100) / 100,
        completedCourses,
        completionRate: totalEnrolled > 0 ? Math.round((completedCourses / totalEnrolled) * 100) : 0,
        categoryStats,
        monthlyEnrollments,
        joinDate: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
});

// @route   GET /api/users/instructors
// @desc    Get all instructors (Admin only)
// @access  Private (Admin)
router.get('/instructors', [protect, authorize('admin')], async (req, res) => {
  try {
    const instructors = await User.find({ role: 'instructor' })
      .select('name email avatar createdAt')
      .populate({
        path: 'enrolledCourses.course',
        select: 'title category'
      });

    const instructorsWithStats = instructors.map(instructor => {
      const totalStudents = instructor.enrolledCourses.length;
      const courses = [...new Set(instructor.enrolledCourses.map(e => e.course.title))];
      
      return {
        id: instructor._id,
        name: instructor.name,
        email: instructor.email,
        avatar: instructor.avatar,
        totalStudents,
        totalCourses: courses.length,
        joinDate: instructor.createdAt
      };
    });

    res.json({
      success: true,
      instructors: instructorsWithStats
    });
  } catch (error) {
    console.error('Get instructors error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching instructors'
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin)
router.put('/:id/role', [
  protect,
  authorize('admin'),
  body('role')
    .isIn(['student', 'instructor', 'admin'])
    .withMessage('Invalid role')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role: req.body.role },
      { new: true, runValidators: true }
    ).select('-password -emailOtp -phoneOtp -otpExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating role'
    });
  }
});

module.exports = router;