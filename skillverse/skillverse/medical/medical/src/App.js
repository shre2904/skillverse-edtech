import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './components/HomePage';
import VRModule from './components/VRModule';
import './App.css';

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
`;

function App() {
  const [currentView, setCurrentView] = useState('home');

  const startVRModule = () => {
    setCurrentView('vr');
  };

  const returnToHome = () => {
    setCurrentView('home');
  };

  return (
    <AppContainer>
      <AnimatePresence mode="wait">
        {currentView === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <HomePage onStartVR={startVRModule} />
          </motion.div>
        )}
        {currentView === 'vr' && (
          <motion.div
            key="vr"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VRModule onReturnHome={returnToHome} />
          </motion.div>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
