import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

const MedicalModule = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the built Medical module
    window.location.href = '/medical-module/index.html';
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-primary-500 border-t-transparent mx-auto mb-4"></div>
        <p className="text-secondary-300 mb-4">Loading Medical VR Module...</p>
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

export default MedicalModule; 