import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  ArrowLeftIcon, 
  BookOpenIcon,
  AcademicCapIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Button from '../components/ui/Button';
import CircuitLearningModule from '../components/learning/CircuitLearningModule';
import MedicalLearningModule from '../components/learning/MedicalLearningModule';
import { useAuth } from '../contexts/AuthContext';
import { coursesAPI } from '../services/api';
import toast from 'react-hot-toast';

const LearningModulePage = () => {
  const { courseId, moduleId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch course data to determine which module to load
  const { data: courseData, isLoading: courseLoading, error } = useQuery(
    ['course', courseId],
    () => coursesAPI.getCourseById(courseId),
    {
      enabled: !!courseId,
    }
  );

  // Fix: Change from courseData?.course to courseData?.data
  const course = courseData?.data;

  useEffect(() => {
    if (course) {
      setIsLoading(false);
    }
  }, [course]);

  const handleModuleComplete = () => {
    toast.success('Congratulations! You have completed the learning module!');
    navigate(`/courses/${courseId}`);
  };

  const handleProgress = (progress) => {
    console.log('Module progress:', progress);
  };

  if (courseLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-secondary-300">Loading learning module...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h2>
          <p className="text-secondary-300 mb-4">The course you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/courses')}>
            Browse Courses
          </Button>
        </div>
      </div>
    );
  }

  // Determine which learning module to render based on course
  const renderLearningModule = () => {
    if (course.title.includes('Circuit') || course.category === 'Engineering') {
      return (
        <CircuitLearningModule
          onComplete={handleModuleComplete}
          onProgress={handleProgress}
        />
      );
    } else if (course.title.includes('Medical') || course.category === 'Anatomy') {
      return (
        <MedicalLearningModule
          onComplete={handleModuleComplete}
          onProgress={handleProgress}
        />
      );
    } else {
      return (
        <div className="text-center py-8">
          <p className="text-secondary-300">Learning module not available for this course.</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="mb-4 flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Course</span>
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {course.title} - Learning Module
              </h1>
              <p className="text-secondary-300 text-lg mb-4">
                {course.description}
              </p>
              <div className="flex items-center space-x-6 text-sm text-secondary-300">
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="h-4 w-4" />
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrophyIcon className="h-4 w-4" />
                  <span>{course.duration} weeks</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {renderLearningModule()}
      </div>
    </div>
  );
};

export default LearningModulePage; 