import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://skillverse-backend-8j15.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data) => {
    const response = await api.post('/api/auth/login', data);
    return response.data;
  },

  register: async (data) => {
    const response = await api.post('/api/auth/register', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/api/auth/profile', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await api.put('/api/auth/password', data);
    return response.data;
  },

  uploadAvatar: async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await api.post('/api/auth/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeAvatar: async () => {
    const response = await api.delete('/api/auth/avatar');
    return response.data;
  },
};

// Courses API
export const coursesAPI = {
  getCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/api/courses?${params.toString()}`);
    return response.data;
  },

  getFeaturedCourses: async () => {
    const response = await api.get('/api/courses/featured');
    return response.data;
  },

  getCourseCategories: async () => {
    const response = await api.get('/api/courses/categories');
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await api.get(`/api/courses/${id}`);
    return response.data;
  },

  createCourse: async (data) => {
    const response = await api.post('/api/courses', data);
    return response.data;
  },

  updateCourse: async (id, data) => {
    const response = await api.put(`/api/courses/${id}`, data);
    return response.data;
  },

  addReview: async (courseId, rating, comment) => {
    const response = await api.post(`/api/courses/${courseId}/reviews`, { rating, comment });
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createOrder: async (courseId) => {
    const response = await api.post('/api/payments/create-order', { courseId });
    return response.data;
  },

  verifyPayment: async (orderId, paymentId, signature) => {
    const response = await api.post('/api/payments/verify-payment', { orderId, paymentId, signature });
    return response.data;
  },

  getPaymentHistory: async () => {
    const response = await api.get('/api/payments/history');
    return response.data;
  },

  createRefund: async (paymentId, amount, reason) => {
    const response = await api.post('/api/payments/refund', { paymentId, amount, reason });
    return response.data;
  },
};

// User API
export const userAPI = {
  getEnrolledCourses: async () => {
    const response = await api.get('/api/users/enrolled-courses');
    return response.data;
  },

  updateCourseProgress: async (courseId, progress, completedLessonId) => {
    const response = await api.put(`/api/users/enrolled-courses/${courseId}/progress`, { progress, completedLessonId });
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/api/users/analytics');
    return response.data;
  },
};

// Chatbot API
export const chatbotAPI = {
  sendMessage: async (data) => {
    const response = await api.post('/api/chatbot/message', data);
    return response.data;
  },

  createSession: async () => {
    const response = await api.post('/api/chatbot/session');
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/api/chatbot/session/${sessionId}`);
    return response.data;
  },

  endSession: async (sessionId) => {
    const response = await api.delete(`/api/chatbot/session/${sessionId}`);
    return response.data;
  },

  getQuickReplies: async () => {
    const response = await api.get('/api/chatbot/quick-replies');
    return response.data;
  },
};

export default api;
