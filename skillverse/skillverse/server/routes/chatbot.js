const express = require('express');
const { body, validationResult } = require('express-validator');
const chatbotService = require('../services/chatbotService');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/chatbot/message
// @desc    Send message to chatbot
// @access  Private
router.post('/message', [
  protect,
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('sessionId')
    .optional()
    .isString()
    .withMessage('Session ID must be a string')
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

    const { message, sessionId } = req.body;
    const userId = req.user._id;

    // Get or create session
    const session = await chatbotService.getOrCreateSession(userId);
    
    // Add user message to session
    await chatbotService.addMessage(session.sessionId, message, 'user');

    // Generate bot response
    const response = await chatbotService.generateResponse(
      message, 
      userId, 
      session.sessionId
    );

    // Add bot response to session
    await chatbotService.addMessage(
      session.sessionId, 
      response.message, 
      'bot', 
      response.messageType, 
      response.metadata
    );

    res.json({
      success: true,
      message: response.message,
      messageType: response.messageType,
      metadata: response.metadata,
      sessionId: session.sessionId,
      intent: response.intent
    });

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing message'
    });
  }
});

// @route   GET /api/chatbot/session/:sessionId
// @desc    Get chat session history
// @access  Private
router.get('/session/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    // Verify session belongs to user
    const session = await require('../models/Chatbot').findOne({
      sessionId,
      userId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    const messages = await chatbotService.getConversationHistory(sessionId);

    res.json({
      success: true,
      messages,
      sessionId,
      isActive: session.isActive
    });

  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching session'
    });
  }
});

// @route   POST /api/chatbot/session
// @desc    Create new chat session
// @access  Private
router.post('/session', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const session = await chatbotService.getOrCreateSession(userId);

    res.json({
      success: true,
      sessionId: session.sessionId,
      message: 'New chat session created'
    });

  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating session'
    });
  }
});

// @route   DELETE /api/chatbot/session/:sessionId
// @desc    End chat session
// @access  Private
router.delete('/session/:sessionId', protect, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user._id;

    // Verify session belongs to user
    const session = await require('../models/Chatbot').findOne({
      sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    await chatbotService.endSession(sessionId);

    res.json({
      success: true,
      message: 'Chat session ended'
    });

  } catch (error) {
    console.error('End session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending session'
    });
  }
});

// @route   GET /api/chatbot/quick-replies
// @desc    Get quick reply options
// @access  Public
router.get('/quick-replies', (req, res) => {
  const quickReplies = [
    {
      title: "Browse Courses",
      payload: "Show me available courses",
      icon: "book"
    },
    {
      title: "Payment Help",
      payload: "I need help with payment",
      icon: "credit-card"
    },
    {
      title: "Technical Support",
      payload: "I have a technical issue",
      icon: "wrench"
    },
    {
      title: "Contact Support",
      payload: "How can I contact support?",
      icon: "phone"
    },
    {
      title: "Course Recommendations",
      payload: "Recommend courses for me",
      icon: "star"
    },
    {
      title: "About SkillVerse",
      payload: "What is SkillVerse?",
      icon: "info"
    }
  ];

  res.json({
    success: true,
    quickReplies
  });
});

module.exports = router;
