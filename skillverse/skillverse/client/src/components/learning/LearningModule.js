import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const LearningModule = ({ moduleData, onComplete, onProgress }) => {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!moduleData || !moduleData.lessons || moduleData.lessons.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-secondary-300">No lessons available in this module.</p>
      </div>
    );
  }

  const currentLessonData = moduleData.lessons[currentLesson];

  const handleNext = () => {
    if (currentLesson < moduleData.lessons.length - 1) {
      setCurrentLesson(currentLesson + 1);
      onProgress?.((currentLesson + 1) / moduleData.lessons.length * 100);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentLesson > 0) {
      setCurrentLesson(currentLesson - 1);
      onProgress?.(currentLesson / moduleData.lessons.length * 100);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-secondary-800 border-secondary-600">
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-secondary-300 mb-2">
              <span>Lesson {currentLesson + 1} of {moduleData.lessons.length}</span>
              <span>{Math.round(((currentLesson + 1) / moduleData.lessons.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-secondary-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLesson + 1) / moduleData.lessons.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Lesson Content */}
          {currentLessonData && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                {currentLessonData.title}
              </h2>
              <p className="text-secondary-300 mb-6">
                {currentLessonData.content}
              </p>
              
              {/* Video/Content Area */}
              <div className="bg-secondary-700 rounded-lg p-8 text-center mb-6">
                <div className="w-16 h-16 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <PlayIcon className="h-8 w-8 text-white" />
                </div>
                <p className="text-secondary-300">
                  {currentLessonData.type === 'video' ? 'Video Content' : 
                   currentLessonData.type === 'interactive' ? 'Interactive Content' : 
                   'Learning Content'}
                </p>
                <p className="text-sm text-secondary-400 mt-2">
                  Duration: {currentLessonData.duration} minutes
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentLesson === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700"
            >
              <span>{currentLesson === moduleData.lessons.length - 1 ? 'Complete' : 'Next'}</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LearningModule; 