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
  AcademicCapIcon,
  HeartIcon
} from '@heroicons/react/24/outline';

const MedicalModule = ({ onComplete, onProgress }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      id: 1,
      title: "Introduction to Lung Anatomy",
      description: "Learn the basic structure and function of human lungs",
      duration: "8 min",
      type: "theory"
    },
    {
      id: 2,
      title: "3D Lung Model Exploration",
      description: "Interact with detailed 3D models of lung structures",
      duration: "12 min",
      type: "3d"
    },
    {
      id: 3,
      title: "Bronchial Tree Visualization",
      description: "Explore the complex branching system of airways",
      duration: "10 min",
      type: "interactive"
    },
    {
      id: 4,
      title: "Respiratory System Function",
      description: "Understand how breathing works in detail",
      duration: "15 min",
      type: "simulation"
    },
    {
      id: 5,
      title: "VR Anatomy Experience",
      description: "Immersive VR exploration of lung anatomy",
      duration: "20 min",
      type: "vr"
    }
  ];

  useEffect(() => {
    // Simulate loading the medical module
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleStepComplete = () => {
    const newProgress = ((currentStep + 1) / steps.length) * 100;
    setProgress(newProgress);
    onProgress?.(newProgress);
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  const goToNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];

  if (!isLoaded) {
    return (
      <Card className="bg-secondary-800 border-secondary-700">
        <CardContent className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading Medical Learning Module...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="bg-secondary-800 border-secondary-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
                <HeartIcon className="h-6 w-6 text-gray-900" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Medical Learning Module</h2>
                <p className="text-text-secondary">VR Lungs Anatomy & 3D Models</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-500">{Math.round(progress)}%</div>
              <div className="text-sm text-text-secondary">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-secondary-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-accent-500 to-primary-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Current Step */}
      <Card className="bg-secondary-800 border-secondary-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">
              Step {currentStep + 1}: {currentStepData.title}
            </h3>
            <div className="flex items-center space-x-2 text-text-secondary">
              <ClockIcon className="h-4 w-4" />
              <span className="text-sm">{currentStepData.duration}</span>
            </div>
          </div>

          <p className="text-text-secondary mb-6">{currentStepData.description}</p>

          {/* Module Container */}
          <div className="relative bg-black rounded-lg overflow-hidden mb-6">
            <div className="aspect-video bg-gradient-to-br from-accent-900 to-primary-800 flex items-center justify-center">
              {currentStepData.type === 'vr' ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-accent-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <AcademicCapIcon className="h-12 w-12 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">VR Anatomy Experience</h3>
                  <p className="text-accent-200 mb-4">Explore lungs in immersive VR environment</p>
                  <Button className="bg-accent-600 hover:bg-accent-700 text-gray-900">
                    Launch VR Experience
                  </Button>
                </div>
              ) : currentStepData.type === '3d' ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-primary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <HeartIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">3D Lung Model</h3>
                  <p className="text-primary-200 mb-4">Interact with detailed 3D anatomy</p>
                  <Button className="bg-primary-600 hover:bg-primary-700">
                    Explore 3D Model
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-24 h-24 bg-secondary-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <PlayIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Learning Content</h3>
                  <p className="text-secondary-300 mb-4">Interactive medical learning</p>
                  <Button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-accent-600 hover:bg-accent-700 text-gray-900"
                  >
                    {isPlaying ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={goToPreviousStep}
              disabled={currentStep === 0}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <Button
              onClick={handleStepComplete}
              className="bg-accent-600 hover:bg-accent-700 text-gray-900 flex items-center space-x-2"
            >
              <CheckCircleIcon className="h-4 w-4" />
              <span>Complete Step</span>
            </Button>

            <Button
              onClick={goToNextStep}
              disabled={currentStep === steps.length - 1}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Steps List */}
      <Card className="bg-secondary-800 border-secondary-700">
        <CardContent className="p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Learning Steps</h4>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  index === currentStep
                    ? 'bg-accent-600/20 border border-accent-500/30'
                    : 'bg-secondary-700 hover:bg-secondary-600'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    index < currentStep
                      ? 'bg-green-500 text-white'
                      : index === currentStep
                      ? 'bg-accent-500 text-gray-900'
                      : 'bg-secondary-600 text-text-secondary'
                  }`}>
                    {index < currentStep ? (
                      <CheckCircleIcon className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <div>
                    <span className={`text-sm ${
                      index === currentStep ? 'text-accent-400 font-medium' : 'text-foreground'
                    }`}>
                      {step.title}
                    </span>
                    <p className="text-xs text-text-secondary mt-1">
                      {step.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-text-secondary">
                  <ClockIcon className="h-4 w-4" />
                  <span className="text-xs">{step.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalModule; 