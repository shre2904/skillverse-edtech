const express = require('express');
const { body, validationResult } = require('express-validator');
const Payment = require('../models/Payment');
const Course = require('../models/Course');
const User = require('../models/User');
const razorpayService = require('../services/razorpayService');
const { protect, requireVerification } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/payments/create-order
// @desc    Create Razorpay order
// @access  Private
router.post('/create-order', [
  protect,
  requireVerification,
  body('courseId')
    .isMongoId()
    .withMessage('Valid course ID is required')
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

    const { courseId } = req.body;

    // Find course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is already enrolled
    const user = await User.findById(req.user._id);
    const isAlreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.course.toString() === courseId
    );

    if (isAlreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // Create receipt
    const receipt = `course_${courseId}_${Date.now()}`;

    // Create Razorpay order
    const orderResult = await razorpayService.createOrder(
      course.price,
      'INR',
      receipt,
      {
        courseId: courseId,
        userId: req.user._id,
        courseTitle: course.title
      }
    );

    if (!orderResult.success) {
      return res.status(500).json({
        success: false,
        message: orderResult.message
      });
    }

    // Create payment record
    const payment = new Payment({
      user: req.user._id,
      course: courseId,
      amount: course.price,
      currency: 'INR',
      razorpayOrderId: orderResult.order.id,
      receipt,
      notes: {
        courseTitle: course.title,
        courseCategory: course.category
      }
    });

    await payment.save();

    res.json({
      success: true,
      message: 'Order created successfully',
      order: {
        id: orderResult.order.id,
        amount: orderResult.order.amount,
        currency: orderResult.order.currency,
        receipt: orderResult.order.receipt
      },
      course: {
        id: course._id,
        title: course.title,
        price: course.price,
        thumbnail: course.thumbnail
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   POST /api/payments/verify-payment
// @desc    Verify payment and complete enrollment
// @access  Private
router.post('/verify-payment', [
  protect,
  requireVerification,
  body('orderId')
    .notEmpty()
    .withMessage('Order ID is required'),
  body('paymentId')
    .notEmpty()
    .withMessage('Payment ID is required'),
  body('signature')
    .notEmpty()
    .withMessage('Payment signature is required')
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

    const { orderId, paymentId, signature } = req.body;

    // Find payment record
    const payment = await Payment.findOne({ 
      razorpayOrderId: orderId,
      user: req.user._id 
    }).populate('course');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    if (payment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Payment already processed'
      });
    }

    // Verify payment signature
    const verification = razorpayService.verifyPaymentSignature(
      orderId,
      paymentId,
      signature
    );

    if (!verification.success) {
      payment.status = 'failed';
      await payment.save();
      
      return res.status(400).json({
        success: false,
        message: verification.message
      });
    }

    // Get payment details from Razorpay
    const paymentDetails = await razorpayService.getPaymentDetails(paymentId);
    
    if (!paymentDetails.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to verify payment with Razorpay'
      });
    }

    // Update payment record
    payment.razorpayPaymentId = paymentId;
    payment.razorpaySignature = signature;
    payment.status = 'completed';
    payment.completedAt = new Date();
    payment.paymentMethod = paymentDetails.payment.method;
    
    await payment.save();

    // Enroll user in course
    const user = await User.findById(req.user._id);
    user.enrolledCourses.push({
      course: payment.course._id,
      enrolledAt: new Date(),
      progress: 0,
      completedLessons: []
    });
    
    user.paymentHistory.push(payment._id);
    await user.save();

    // Update course enrollment count
    await Course.findByIdAndUpdate(payment.course._id, {
      $inc: { enrollmentCount: 1 }
    });

    res.json({
      success: true,
      message: 'Payment verified and enrollment completed successfully',
      payment: {
        id: payment._id,
        amount: payment.amount,
        status: payment.status,
        course: {
          id: payment.course._id,
          title: payment.course.title,
          thumbnail: payment.course.thumbnail
        },
        completedAt: payment.completedAt
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment'
    });
  }
});

// @route   GET /api/payments/history
// @desc    Get user payment history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('course', 'title thumbnail category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments: payments.map(payment => ({
        id: payment._id,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        course: payment.course,
        createdAt: payment.createdAt,
        completedAt: payment.completedAt,
        receipt: payment.receipt
      }))
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment history'
    });
  }
});

// @route   POST /api/payments/refund
// @desc    Create refund for a payment
// @access  Private
router.post('/refund', [
  protect,
  body('paymentId')
    .isMongoId()
    .withMessage('Valid payment ID is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Valid refund amount is required'),
  body('reason')
    .notEmpty()
    .withMessage('Refund reason is required')
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

    const { paymentId, amount, reason } = req.body;

    // Find payment
    const payment = await Payment.findOne({
      _id: paymentId,
      user: req.user._id,
      status: 'completed'
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found or not eligible for refund'
      });
    }

    if (amount > payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Refund amount cannot exceed payment amount'
      });
    }

    // Create refund with Razorpay
    const refundResult = await razorpayService.createRefund(
      payment.razorpayPaymentId,
      amount,
      { reason }
    );

    if (!refundResult.success) {
      return res.status(500).json({
        success: false,
        message: refundResult.message
      });
    }

    // Update payment record
    payment.refund.amount = amount;
    payment.refund.razorpayRefundId = refundResult.refund.id;
    payment.refund.reason = reason;
    payment.refund.processedAt = new Date();
    payment.status = 'refunded';
    
    await payment.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      refund: {
        id: refundResult.refund.id,
        amount: amount,
        reason: reason,
        processedAt: payment.refund.processedAt
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing refund'
    });
  }
});

module.exports = router;