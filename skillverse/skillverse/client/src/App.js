import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import CircuitCourse from './pages/CircuitCourse';
import MedicalCourse from './pages/MedicalCourse';
import Profile from './pages/Profile';
import PaymentHistory from './pages/PaymentHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import LearningModulePage from './pages/LearningModule';
import CircuitModule from './pages/CircuitModule';
import MedicalModule from './pages/MedicalModule';

// Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Chatbot from './components/chatbot/Chatbot';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:id" element={<CourseDetail />} />
                  <Route path="/circuit-course" element={<CircuitCourse />} />
                  <Route path="/medical-course" element={<MedicalCourse />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/payments" element={
                    <ProtectedRoute>
                      <PaymentHistory />
                    </ProtectedRoute>
                  } />
                  <Route path="/learning/:courseId/:moduleId" element={<LearningModulePage />} />
                  <Route path="/circuit-module" element={<CircuitModule />} />
                  <Route path="/medical-module" element={<MedicalModule />} />
                  
                  {/* 404 Route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Chatbot />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid #334155'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#f8fafc'
            }
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#f8fafc'
            }
          }
        }}
      />
    </HelmetProvider>
  );
}

export default App;
