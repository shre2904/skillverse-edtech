import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const CircuitModule = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the running Circuit VR module
    window.location.href = 'http://localhost:3000';
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-secondary-300 mb-4">Loading Circuit VR Module...</p>
        <p className="text-sm text-secondary-400 mb-4">
          If the module doesn't load automatically, 
          <a 
            href="http://localhost:3000" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-400 ml-1 underline"
          >
            click here to open it manually
          </a>
        </p>
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="flex items-center space-x-2 mx-auto"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to Learning Module</span>
        </Button>
      </div>
    </div>
  );
};

export default CircuitModule; 