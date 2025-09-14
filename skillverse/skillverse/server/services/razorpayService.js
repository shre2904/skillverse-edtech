const Razorpay = require('razorpay');
const crypto = require('crypto');

class RazorpayService {
  constructor() {
    this.instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }

  // Create order
  async createOrder(amount, currency = 'INR', receipt, notes = {}) {
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
    try {
      const body = orderId + '|' + paymentId;
      const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      const isValid = expectedSignature === signature;
      
      return {
        success: isValid,
        message: isValid ? 'Payment signature verified' : 'Invalid payment signature'
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

  // Capture payment
  async capturePayment(paymentId, amount) {
    try {
      const payment = await this.instance.payments.capture(
        paymentId,
        amount * 100, // Convert to paise
        'INR'
      );

      return {
        success: true,
        payment,
        message: 'Payment captured successfully'
      };
    } catch (error) {
      console.error('Payment capture error:', error);
      return {
        success: false,
        message: 'Failed to capture payment',
        error: error.message
      };
    }
  }

  // Get payment details
  async getPaymentDetails(paymentId) {
    try {
      const payment = await this.instance.payments.fetch(paymentId);
      return {
        success: true,
        payment,
        message: 'Payment details retrieved successfully'
      };
    } catch (error) {
      console.error('Get payment details error:', error);
      return {
        success: false,
        message: 'Failed to get payment details',
        error: error.message
      };
    }
  }

  // Create refund
  async createRefund(paymentId, amount, notes = {}) {
    try {
      const refund = await this.instance.payments.refund(paymentId, {
        amount: amount * 100, // Convert to paise
        notes
      });

      return {
        success: true,
        refund,
        message: 'Refund created successfully'
      };
    } catch (error) {
      console.error('Refund creation error:', error);
      return {
        success: false,
        message: 'Failed to create refund',
        error: error.message
      };
    }
  }

  // Get order details
  async getOrderDetails(orderId) {
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