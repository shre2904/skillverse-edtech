import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  CpuChipIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CircuitModule from '../components/courses/CircuitModule';
import toast from 'react-hot-toast';

const CircuitCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const courseData = {
    id: courseId || 'circuit-101',
    title: 'Interactive Circuit Learning with VR/AR',
    description: 'Master electronics through immersive circuit building, real-time simulation, and guided tutorials in virtual reality.',
    instructor: 'Dr. Sarah Johnson',
    duration: '2 hours',
    level: 'Intermediate',
    rating: 4.9,
    students: 1250,
    price: 2999,
    features: [
      'Drag & Drop Circuit Building',
      'Real-time Electrical Simulation',
      'VR/AR Immersive Experience',
      'Interactive Component Library',
      'Progress Tracking & Analytics'
    ]
  };

  useEffect(() => {
    // Simulate checking enrollment status
    const timer = setTimeout(() => {
      setIsEnrolled(true); // For demo purposes
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [courseId]);

  const handleModuleComplete = () => {
    toast.success('Congratulations! You\'ve completed the Circuit Learning Module!');
    navigate('/dashboard');
  };

  const handleProgress = (progress) => {
    console.log('Circuit module progress:', progress);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            onClick={() => navigate('/courses')}
            variant="outline"
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Courses</span>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <CpuChipIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">{courseData.title}</h1>
                  <p className="text-text-secondary">by {courseData.instructor}</p>
                </div>
              </div>
              
              <p className="text-lg text-text-secondary mb-6">{courseData.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center space-x-2 text-text-secondary">
                  <ClockIcon className="h-5 w-5" />
                  <span>{courseData.duration}</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary">
                  <AcademicCapIcon className="h-5 w-5" />
                  <span>{courseData.level}</span>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary">
                  <StarIcon className="h-5 w-5 text-accent-500" />
                  <span>{courseData.rating} ({courseData.students} students)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-text-secondary">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-secondary-800 border-secondary-700 sticky top-8">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-foreground mb-2">
                      ₹{courseData.price}
                    </div>
                    <div className="text-text-secondary">One-time payment</div>
                  </div>

                  {isEnrolled ? (
                    <Button 
                      onClick={() => navigate('/courses')}
                      className="w-full bg-primary-600 hover:bg-primary-700"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button className="w-full bg-primary-600 hover:bg-primary-700">
                      Enroll Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Learning Module */}
        {isEnrolled && (
          <CircuitModule
            onComplete={handleModuleComplete}
            onProgress={handleProgress}
          />
        )}
      </div>
    </div>
  );
};

export default CircuitCourse; 