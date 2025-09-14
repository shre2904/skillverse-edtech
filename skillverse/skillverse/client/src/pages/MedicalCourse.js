import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  HeartIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MedicalModule from '../components/courses/MedicalModule';
import toast from 'react-hot-toast';

const MedicalCourse = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const courseData = {
    id: courseId || 'medical-101',
    title: 'VR Lungs Anatomy Learning Module',
    description: 'Explore human lung anatomy through interactive 3D models, guided instruction systems, and immersive VR experiences.',
    instructor: 'Dr. Michael Chen',
    duration: '1.5 hours',
    level: 'Beginner',
    rating: 4.8,
    students: 890,
    price: 2499,
    features: [
      'Interactive 3D Lung Models',
      'VR Immersive Experience',
      'Bronchial Tree Visualization',
      'Real-time Anatomy Exploration',
      'Guided Learning System'
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
    toast.success('Congratulations! You\'ve completed the Medical Learning Module!');
    navigate('/dashboard');
  };

  const handleProgress = (progress) => {
    console.log('Medical module progress:', progress);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent-500 border-t-transparent mx-auto mb-4"></div>
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
                <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
                  <HeartIcon className="h-6 w-6 text-gray-900" />
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
                    <div className="w-2 h-2 bg-accent-500 rounded-full"></div>
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
                      className="w-full bg-accent-600 hover:bg-accent-700 text-gray-900"
                    >
                      Continue Learning
                    </Button>
                  ) : (
                    <Button className="w-full bg-accent-600 hover:bg-accent-700 text-gray-900">
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
          <MedicalModule
            onComplete={handleModuleComplete}
            onProgress={handleProgress}
          />
        )}
      </div>
    </div>
  );
};

export default MedicalCourse; 