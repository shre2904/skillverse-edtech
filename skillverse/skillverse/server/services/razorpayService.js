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
      console.log('✅ Razorpay configured successfully');
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

  // Verify payment signature
  verifyPaymentSignature(orderId, paymentId, signature) {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Razorpay not configured'
      };
    }

    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === signature;
      
      return {
        success: isValid,
        message: isValid ? 'Payment verified successfully' : 'Payment verification failed'
      };
    } catch (error) {
      console.error('Payment verification error:', error);
      return {
        success: false,
        message: 'Payment verification failed',
        error: error.message
      };
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
    if (!this.isConfigured) {
      return {
        success: false,
        message: 'Razorpay not configured'
      };
    }

    try {
      const order = await this.instance.orders.fetch(orderId);
      return {
        success: true,
        order,
        message: 'Order details retrieved successfully'
      };
    } catch (error) {
      console.error('Get order details error:', error);
      return {
        success: false,
        message: 'Failed to get order details',
        error: error.message
      };
    }
  }
}

module.exports = new RazorpayService();