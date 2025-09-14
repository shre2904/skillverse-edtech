import React, { useState } from 'react';
import HomePage from './components/HomePage';
import DirectVRSimulation from './components/DirectVRSimulation';

function App() {
  const [showVR, setShowVR] = useState(false);

  if (showVR) {
    return (
      <DirectVRSimulation 
        isVisible={showVR}
        onClose={() => setShowVR(false)}
      />
    );
  }

  return (
    <HomePage onEnterVR={() => setShowVR(true)} />
  );
}

export default App;
