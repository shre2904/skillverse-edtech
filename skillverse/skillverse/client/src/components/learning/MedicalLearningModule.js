import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import Button from '../ui/Button';
import { 
  PlayIcon, 
  PauseIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const MedicalLearningModule = ({ onComplete, onProgress }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const medicalSteps = [
    {
      id: 1,
      title: 'Introduction to Human Anatomy',
      content: 'Begin your journey into human anatomy with a comprehensive overview of body systems.',
      type: 'video',
      duration: 15,
      vrContent: 'anatomy-intro-vr'
    },
    {
      id: 2,
      title: 'VR Lungs Exploration',
      content: 'Dive deep into the respiratory system with our VR Lungs Exploration module.',
      type: 'interactive',
      duration: 20,
      vrContent: 'lungs-vr-exploration'
    },
    {
      id: 3,
      title: 'Heart and Circulatory System',
      content: 'Explore the cardiovascular system with detailed 3D models of the heart.',
      type: 'interactive',
      duration: 18,
      vrContent: 'heart-circulatory-vr'
    },
    {
      id: 4,
      title: 'Medical Case Studies',
      content: 'Apply your knowledge with real medical case studies and diagnostic scenarios.',
      type: 'case-study',
      duration: 25,
      vrContent: 'medical-cases-vr'
    }
  ];

  const currentStepData = medicalSteps[currentStep];

  useEffect(() => {
    // Simulate loading your Medical module
    const loadMedicalModule = async () => {
      setIsLoaded(false);
      // Here you would load your actual Medical module
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsLoaded(true);
    };
    
    loadMedicalModule();
  }, []);

  const handleNext = () => {
    if (currentStep < medicalSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      onProgress?.((currentStep + 1) / medicalSteps.length * 100);
    } else {
      onComplete?.();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onProgress?.(currentStep / medicalSteps.length * 100);
    }
  };

  const handleStartVR = () => {
    console.log('Starting Medical VR Module...');
    
    // Create a temporary link and click it (this bypasses popup blockers)
    const link = document.createElement('a');
    link.href = '/medical-module/index.html';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Medical VR Module launched!');
  };

  if (!isLoaded) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-secondary-300 mb-4">Loading Medical Learning Module...</p>
        <p className="text-sm text-secondary-400">Initializing 3D anatomy models...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-secondary-800 border-secondary-600">
        <CardContent className="p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-secondary-300 mb-2">
              <span>Step {currentStep + 1} of {medicalSteps.length}</span>
              <span>{Math.round(((currentStep + 1) / medicalSteps.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-secondary-700 rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / medicalSteps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mr-4">
                <HeartIcon className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentStepData.title}
                </h2>
                <p className="text-secondary-300">
                  Duration: {currentStepData.duration} minutes
                </p>
              </div>
            </div>

            <p className="text-secondary-300 mb-6 text-lg">
              {currentStepData.content}
            </p>
            
            {/* VR/AR Content Area */}
            <div className="bg-gradient-to-br from-accent-500/20 to-primary-500/20 rounded-lg p-8 text-center mb-6 border border-accent-500/30">
              <div className="w-20 h-20 bg-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <PlayIcon className="h-10 w-10 text-gray-900" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {currentStepData.type === 'video' ? 'Video Lesson' : 
                 currentStepData.type === 'interactive' ? 'Interactive VR Experience' : 
                 'Case Study Analysis'}
              </h3>
              <p className="text-secondary-300 mb-4">
                {currentStepData.type === 'interactive' ? 
                  'Put on your VR headset and explore human anatomy!' : 
                  'Watch the video lesson to understand the concepts.'}
              </p>
              
              {currentStepData.type === 'interactive' && (
                <Button
                  onClick={handleStartVR}
                  className="bg-accent-500 hover:bg-accent-600 text-gray-900 px-6 py-3 text-lg font-semibold"
                >
                  Launch VR Module
                </Button>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
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
              <span>{currentStep === medicalSteps.length - 1 ? 'Complete Module' : 'Next Step'}</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalLearningModule;
