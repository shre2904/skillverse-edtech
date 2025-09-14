import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import CircuitModule from '../components/courses/CircuitModule';
import MedicalModule from '../components/courses/MedicalModule';

const ModuleTest = () => {
  const [activeModule, setActiveModule] = useState('circuit');
  const [testResults, setTestResults] = useState([]);

  const runTests = () => {
    const results = [];
    
    // Test 1: Check if modules render
    const circuitModule = document.querySelector('[data-testid="circuit-module"]');
    const medicalModule = document.querySelector('[data-testid="medical-module"]');
    
    results.push({
      test: 'Circuit Module Rendering',
      status: circuitModule ? 'PASS' : 'FAIL',
      message: circuitModule ? 'Circuit module renders correctly' : 'Circuit module failed to render'
    });
    
    results.push({
      test: 'Medical Module Rendering',
      status: medicalModule ? 'PASS' : 'FAIL',
      message: medicalModule ? 'Medical module renders correctly' : 'Medical module failed to render'
    });
    
    // Test 2: Check navigation
    const circuitButton = document.querySelector('[data-testid="circuit-course-button"]');
    const medicalButton = document.querySelector('[data-testid="medical-course-button"]');
    
    results.push({
      test: 'Circuit Course Navigation',
      status: circuitButton ? 'PASS' : 'FAIL',
      message: circuitButton ? 'Circuit course button found' : 'Circuit course button not found'
    });
    
    results.push({
      test: 'Medical Course Navigation',
      status: medicalButton ? 'PASS' : 'FAIL',
      message: medicalButton ? 'Medical course button found' : 'Medical course button not found'
    });
    
    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Module Testing Dashboard</h1>
        
        {/* Test Controls */}
        <div className="mb-8">
          <button
            onClick={runTests}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg mr-4"
          >
            Run Tests
          </button>
          <Link
            to="/"
            className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg"
          >
            Back to Home
          </Link>
        </div>

        {/* Test Results */}
        {testResults.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Test Results</h2>
            <div className="space-y-2">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    result.status === 'PASS' 
                      ? 'bg-green-900/20 border border-green-500/30' 
                      : 'bg-red-900/20 border border-red-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">{result.test}</span>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      result.status === 'PASS' 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {result.status}
                    </span>
                  </div>
                  <p className="text-text-secondary mt-2">{result.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Module Testing */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Circuit Module Test</h2>
            <div className="border border-secondary-600 rounded-lg p-4">
              <CircuitModule 
                onComplete={() => console.log('Circuit module completed')}
                onProgress={(progress) => console.log('Circuit progress:', progress)}
              />
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Medical Module Test</h2>
            <div className="border border-secondary-600 rounded-lg p-4">
              <MedicalModule 
                onComplete={() => console.log('Medical module completed')}
                onProgress={(progress) => console.log('Medical progress:', progress)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleTest; 