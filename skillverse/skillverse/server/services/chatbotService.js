const Course = require('../models/Course');
const User = require('../models/User');
const ChatSession = require('../models/Chatbot');

class ChatbotService {
  constructor() {
    // Simple keyword-based intent detection
    this.intents = {
      greeting: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'start'],
      course_inquiry: ['course', 'courses', 'learn', 'study', 'programming', 'design', 'business', 'engineering', 'science', 'math'],
      payment_help: ['payment', 'pay', 'money', 'price', 'cost', 'refund', 'billing', 'purchase'],
      technical_support: ['login', 'password', 'error', 'bug', 'problem', 'issue', 'help', 'support', 'trouble'],
      general: ['what', 'how', 'when', 'where', 'why', 'tell me', 'explain', 'about']
    };
    
    this.responses = {
      greeting: [
        "Hello! I'm here to help you with SkillVerse. How can I assist you today?",
        "Hi there! Welcome to SkillVerse. What would you like to know?",
        "Hey! I'm your SkillVerse assistant. How can I help you learn today?"
      ],
      course_inquiry: [
        "I'd be happy to help you find the perfect course! What subject are you interested in?",
        "Great! Let me help you discover some amazing courses. What would you like to learn?",
        "I can help you find courses that match your interests. What are you looking to study?"
      ],
      payment_help: [
        "I can help you with payment-related questions. What specific payment issue are you facing?",
        "Let me assist you with payment matters. What do you need help with?",
        "I'm here to help with payment questions. What would you like to know?"
      ],
      technical_support: [
        "I'll help you resolve any technical issues. Can you describe what's happening?",
        "Let me assist you with technical problems. What error are you seeing?",
        "I'm here to help with technical support. What issue are you experiencing?"
      ],
      general: [
        "I'm here to help! Can you tell me more about what you need?",
        "I'd be happy to assist you. What specific information are you looking for?",
        "Let me help you with that. Can you provide more details?"
      ]
    };
  }

  // Simple keyword-based intent detection
  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [intent, keywords] of Object.entries(this.intents)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        return intent;
      }
    }
    
    return 'general';
  }

  // Generate response based on intent and context
  async generateResponse(message, userId, sessionId) {
    const intent = this.detectIntent(message);
    let response = '';
    let messageType = 'text';
    let metadata = {};

    try {
      switch (intent) {
        case 'greeting':
          response = this.getRandomResponse('greeting');
          break;

        case 'course_inquiry':
          const courseSuggestions = await this.getCourseSuggestions(message, userId);
          if (courseSuggestions.length > 0) {
            response = "Here are some courses that might interest you:";
            messageType = 'course_suggestion';
            metadata = { courses: courseSuggestions };
          } else {
            response = this.getRandomResponse('course_inquiry');
          }
          break;

        case 'payment_help':
          response = this.handlePaymentQuery(message);
          break;

        case 'technical_support':
          response = this.handleTechnicalQuery(message);
          break;

        case 'general':
          response = this.handleGeneralQuery(message);
          break;

        default:
          response = "I'm not sure I understand. Can you rephrase your question?";
      }

      return {
        message: response,
        messageType,
        metadata,
        intent
      };

    } catch (error) {
      console.error('Error generating chatbot response:', error);
      return {
        message: "I'm sorry, I encountered an error. Please try again or contact support.",
        messageType: 'text',
        metadata: {},
        intent: 'general'
      };
    }
  }

  // Get course suggestions based on user query
  async getCourseSuggestions(message, userId) {
    try {
      // Extract keywords from message
      const keywords = this.extractKeywords(message);
      
      // Build search query
      const searchQuery = {
        isPublished: true,
        $or: [
          { title: { $regex: keywords.join('|'), $options: 'i' } },
          { description: { $regex: keywords.join('|'), $options: 'i' } },
          { category: { $in: keywords } },
          { tags: { $in: keywords } }
        ]
      };

      // Get user's enrolled courses to avoid suggesting them
      const user = await User.findById(userId);
      const enrolledCourseIds = user?.enrolledCourses?.map(e => e.course) || [];

      if (enrolledCourseIds.length > 0) {
        searchQuery._id = { $nin: enrolledCourseIds };
      }

      const courses = await Course.find(searchQuery)
        .populate('instructor', 'name avatar')
        .select('title description thumbnail price category level rating enrollmentCount')
        .limit(3)
        .sort({ 'rating.average': -1, enrollmentCount: -1 });

      return courses.map(course => ({
        id: course._id,
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail,
        price: course.price,
        category: course.category,
        level: course.level,
        rating: course.rating.average,
        instructor: course.instructor.name
      }));

    } catch (error) {
      console.error('Error getting course suggestions:', error);
      return [];
    }
  }

  // Simple keyword extraction
  extractKeywords(message) {
    const words = message.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2)
      .slice(0, 5);

    return words;
  }

  // Handle payment-related queries
  handlePaymentQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('refund')) {
      return "For refunds, please contact our support team at support@skillverse.com or visit the Payment History section in your dashboard. Refunds are processed within 5-7 business days.";
    }
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
      return "Course prices vary depending on the content and duration. You can see the price of each course on the course detail page. We also offer discounts and promotions regularly!";
    }
    
    if (lowerMessage.includes('payment method')) {
      return "We accept all major credit cards, debit cards, UPI, net banking, and digital wallets through Razorpay. All payments are secure and encrypted.";
    }
    
    return this.getRandomResponse('payment_help');
  }

  // Handle technical support queries
  handleTechnicalQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('login') || lowerMessage.includes('password')) {
      return "If you're having trouble logging in, try resetting your password using the 'Forgot Password' link on the login page. If the issue persists, contact support@skillverse.com";
    }
    
    if (lowerMessage.includes('video') || lowerMessage.includes('play')) {
      return "If videos aren't playing, try refreshing the page or clearing your browser cache. Make sure you have a stable internet connection. If the problem continues, contact our technical support.";
    }
    
    if (lowerMessage.includes('mobile') || lowerMessage.includes('app')) {
      return "SkillVerse is currently web-based and works great on mobile browsers. We're working on a mobile app that will be available soon!";
    }
    
    return "I understand you're having a technical issue. Please describe the problem in detail, and I'll help you resolve it or connect you with our technical team.";
  }

  // Handle general queries
  handleGeneralQuery(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('what is skillverse') || lowerMessage.includes('about skillverse')) {
      return "SkillVerse is an advanced EdTech platform offering interactive courses with AR/VR content, expert instructors, and personalized learning experiences. We cover programming, design, business, engineering, and more!";
    }
    
    if (lowerMessage.includes('how to enroll') || lowerMessage.includes('enroll')) {
      return "To enroll in a course: 1) Browse our courses, 2) Click on a course you like, 3) Click 'Enroll Now', 4) Complete the payment, 5) Start learning! It's that simple!";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('support')) {
      return "You can reach us at support@skillverse.com or use this chat for immediate assistance. Our support team is available 24/7 to help you!";
    }
    
    return this.getRandomResponse('general');
  }

  // Get random response for an intent
  getRandomResponse(intent) {
    const responses = this.responses[intent] || this.responses.general;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Create or get chat session
  async getOrCreateSession(userId) {
    try {
      // Check for existing active session
      let session = await ChatSession.findOne({ 
        userId, 
        isActive: true 
      }).sort({ lastActivity: -1 });

      // If no active session or last activity was more than 30 minutes ago
      if (!session || (Date.now() - session.lastActivity.getTime()) > 30 * 60 * 1000) {
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        session = new ChatSession({
          userId,
          sessionId,
          messages: [],
          isActive: true
        });
        
        await session.save();
      }

      return session;
    } catch (error) {
      console.error('Error creating/getting chat session:', error);
      throw error;
    }
  }

  // Add message to session
  async addMessage(sessionId, message, sender, messageType = 'text', metadata = {}) {
    try {
      const chatMessage = {
        message,
        sender,
        messageType,
        metadata,
        timestamp: new Date()
      };

      await ChatSession.findOneAndUpdate(
        { sessionId },
        {
          $push: { messages: chatMessage },
          $set: { lastActivity: new Date() }
        }
      );

      return chatMessage;
    } catch (error) {
      console.error('Error adding message to session:', error);
      throw error;
    }
  }

  // Get conversation history
  async getConversationHistory(sessionId, limit = 50) {
    try {
      const session = await ChatSession.findOne({ sessionId });
      if (!session) return [];

      return session.messages
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-limit);
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }

  // End chat session
  async endSession(sessionId) {
    try {
      await ChatSession.findOneAndUpdate(
        { sessionId },
        { isActive: false }
      );
    } catch (error) {
      console.error('Error ending chat session:', error);
    }
  }
}

module.exports = new ChatbotService();
