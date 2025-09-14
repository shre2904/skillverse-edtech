import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree, useThree as useThreeCanvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Environment } from '@react-three/drei';
import styled from 'styled-components';

const VRContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  z-index: 2000;
  overflow: hidden;
`;

const VRUI = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 10;
`;

const VRControls = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 20;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const VRButton = styled.button`
  padding: 12px 20px;
  background: rgba(255, 0, 0, 0.2);
  border: 2px solid #ff0000;
  border-radius: 10px;
  color: #ff0000;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: rgba(255, 0, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(255, 0, 0, 0.3);
  }
`;

const VRControlPanel = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ffff;
  border-radius: 15px;
  padding: 20px;
  z-index: 20;
  backdrop-filter: blur(10px);
  max-width: 300px;
`;

const ControlTitle = styled.h3`
  color: #00ffff;
  margin-bottom: 15px;
  font-size: 16px;
  text-align: center;
`;

const ControlButton = styled.button`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  background: ${props => props.active ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.1)'};
  border: 1px solid #00ffff;
  border-radius: 8px;
  color: #00ffff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.2);
  }
`;

const ComponentPalette = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ffff;
  border-radius: 15px;
  padding: 15px;
  z-index: 20;
  backdrop-filter: blur(10px);
  max-width: 200px;
`;

const PaletteTitle = styled.h3`
  color: #00ffff;
  margin-bottom: 10px;
  font-size: 14px;
  text-align: center;
`;

const PaletteItem = styled.div`
  padding: 8px;
  margin: 5px 0;
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  border-radius: 5px;
  color: #ffffff;
  cursor: pointer;
  font-size: 12px;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.2);
  }
`;

const VRInfo = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  color: #00ffff;
  padding: 20px;
  border-radius: 15px;
  border: 1px solid #00ffff;
  z-index: 20;
  max-width: 350px;
  backdrop-filter: blur(10px);
`;

const VRTitle = styled.h2`
  color: #00ffff;
  margin-bottom: 15px;
  font-size: 20px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const VRDescription = styled.p`
  color: #ffffff;
  line-height: 1.6;
  margin-bottom: 10px;
  font-size: 14px;
`;

const VRStatus = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 255, 0, 0.2);
  border: 1px solid #00ff00;
  padding: 15px 25px;
  border-radius: 25px;
  color: #00ff00;
  font-weight: 600;
  z-index: 20;
  backdrop-filter: blur(10px);
  font-size: 16px;
`;

const TutorialPanel = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.9);
  border: 2px solid #00ffff;
  border-radius: 20px;
  padding: 30px;
  z-index: 30;
  backdrop-filter: blur(15px);
  max-width: 500px;
  text-align: center;
`;

const TutorialTitle = styled.h2`
  color: #00ffff;
  margin-bottom: 20px;
  font-size: 24px;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const TutorialStep = styled.div`
  color: #ffffff;
  margin-bottom: 15px;
  font-size: 16px;
  line-height: 1.6;
`;

const TutorialButton = styled.button`
  padding: 12px 25px;
  margin: 10px;
  background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
  border: none;
  border-radius: 10px;
  color: #000000;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
  }
`;

const InstructionPanel = styled.div`
  position: absolute;
  bottom: 100px;
  right: 20px;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #00ff00;
  border-radius: 15px;
  padding: 20px;
  z-index: 20;
  backdrop-filter: blur(10px);
  max-width: 300px;
`;

const InstructionTitle = styled.h3`
  color: #00ff00;
  margin-bottom: 15px;
  font-size: 16px;
  text-align: center;
`;

const InstructionStep = styled.div`
  color: #ffffff;
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px;
  background: rgba(0, 255, 0, 0.1);
  border-radius: 5px;
  border-left: 3px solid #00ff00;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(0, 255, 0, 0.2);
  border-radius: 4px;
  margin-bottom: 15px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #00ff00, #00ffff);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
`;

// Circuit Tutorial Definitions
const circuitTutorials = {
  simpleLED: {
    name: "Simple LED Circuit",
    description: "Build a basic LED circuit with battery and resistor",
    steps: [
      {
        id: 1,
        instruction: "Add a 9V battery to the workspace",
        component: "battery",
        position: [-2, 0.5, 0],
        completed: false
      },
      {
        id: 2,
        instruction: "Add a 1kΩ resistor next to the battery",
        component: "resistor",
        position: [0, 0.5, 0],
        completed: false
      },
      {
        id: 3,
        instruction: "Add an LED after the resistor",
        component: "led",
        position: [2, 0.5, 0],
        completed: false
      },
      {
        id: 4,
        instruction: "Position components in a line and start simulation",
        completed: false
      }
    ]
  },
  parallelLEDs: {
    name: "Parallel LED Circuit",
    description: "Build two LEDs in parallel with a battery",
    steps: [
      {
        id: 1,
        instruction: "Add a 9V battery to the workspace",
        component: "battery",
        position: [-2, 0.5, 0],
        completed: false
      },
      {
        id: 2,
        instruction: "Add first LED on the left side",
        component: "led",
        position: [0, 0.5, -1],
        completed: false
      },
      {
        id: 3,
        instruction: "Add second LED on the right side",
        component: "led",
        position: [0, 0.5, 1],
        completed: false
      },
      {
        id: 4,
        instruction: "Add resistors in series with each LED",
        component: "resistor",
        position: [2, 0.5, 0],
        completed: false
      }
    ]
  },
  seriesResistors: {
    name: "Series Resistor Circuit",
    description: "Build a circuit with multiple resistors in series",
    steps: [
      {
        id: 1,
        instruction: "Add a 9V battery to the workspace",
        component: "battery",
        position: [-2, 0.5, 0],
        completed: false
      },
      {
        id: 2,
        instruction: "Add first resistor (1kΩ)",
        component: "resistor",
        position: [0, 0.5, 0],
        completed: false
      },
      {
        id: 3,
        instruction: "Add second resistor (2kΩ)",
        component: "resistor",
        position: [2, 0.5, 0],
        completed: false
      },
      {
        id: 4,
        instruction: "Add an LED to complete the circuit",
        component: "led",
        position: [4, 0.5, 0],
        completed: false
      }
    ]
  }
};

// Tutorial Component
function TutorialComponent({ 
  isVisible, 
  onClose, 
  onStartTutorial, 
  selectedTutorial, 
  setSelectedTutorial 
}) {
  if (!isVisible) return null;

  return (
    <TutorialPanel>
      <TutorialTitle>Circuit Assembly Tutorials</TutorialTitle>
      <TutorialStep>
        Choose a circuit to build step by step with guided instructions
      </TutorialStep>
      
      {Object.keys(circuitTutorials).map(tutorialKey => (
        <TutorialButton
          key={tutorialKey}
          onClick={() => {
            setSelectedTutorial(tutorialKey);
            onStartTutorial(tutorialKey);
          }}
          style={{
            background: selectedTutorial === tutorialKey ? 
              'rgba(0, 255, 0, 0.3)' : 
              'linear-gradient(135deg, #00ffff 0%, #0080ff 100%)'
          }}
        >
          {circuitTutorials[tutorialKey].name}
        </TutorialButton>
      ))}
      
      <TutorialButton onClick={onClose}>
        Close Tutorial
      </TutorialButton>
    </TutorialPanel>
  );
}

// Instruction Panel Component
function InstructionPanelComponent({ 
  tutorial, 
  currentStep, 
  progress, 
  onNextStep, 
  onPrevStep, 
  onCompleteTutorial 
}) {
  // Always show the panel, even if no tutorial
  if (!tutorial) {
    return (
      <InstructionPanel>
        <InstructionTitle>No Tutorial Active</InstructionTitle>
        <InstructionStep>
          Click "📚 TUTORIALS" to start a guided circuit assembly
        </InstructionStep>
      </InstructionPanel>
    );
  }

  const currentStepData = tutorial.steps[currentStep];
  const isLastStep = currentStep === tutorial.steps.length - 1;

  return (
    <InstructionPanel>
      <InstructionTitle>
        {tutorial.name} - Step {currentStep + 1} of {tutorial.steps.length}
      </InstructionTitle>
      
      <ProgressBar>
        <ProgressFill progress={progress} />
      </ProgressBar>
      
      <InstructionStep>
        <strong>Current Step:</strong><br />
        {currentStepData?.instruction || "No instruction available"}
      </InstructionStep>
      
      {currentStepData?.component && (
        <InstructionStep>
          <strong>Component:</strong> {currentStepData.component.toUpperCase()}
        </InstructionStep>
      )}
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <TutorialButton 
          onClick={onPrevStep}
          disabled={currentStep === 0}
          style={{ 
            background: currentStep === 0 ? '#666' : 'rgba(0, 255, 255, 0.2)',
            color: currentStep === 0 ? '#999' : '#00ffff',
            cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          ← Previous
        </TutorialButton>
        
        {isLastStep ? (
          <TutorialButton onClick={onCompleteTutorial}>
            ✅ Complete
          </TutorialButton>
        ) : (
          <TutorialButton onClick={onNextStep}>
            Next →
          </TutorialButton>
        )}
      </div>
    </InstructionPanel>
  );
}

// VR Hand/Controller
function VRHand({ position, isLeft = false }) {
  const handRef = useRef();
  
  useFrame((state) => {
    if (handRef.current) {
      handRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      handRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.5) * 0.1;
      handRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 3) * 0.15;
    }
  });

  return (
    <group ref={handRef}>
      <Box args={[0.15, 0.25, 0.08]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#333333" emissive="#00ffff" emissiveIntensity={0.3} />
      </Box>
      <Box args={[0.08, 0.12, 0.03]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#666666" emissive="#00ffff" emissiveIntensity={0.2} />
      </Box>
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.12}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {isLeft ? 'L HAND' : 'R HAND'}
      </Text>
    </group>
  );
}

// VR Resistor
function VRResistor({ position, isActive, isSelected, isDragging, onSelect, onDrag, onDrop }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      if (isActive) {
        meshRef.current.material.emissive.setHex(0x444400);
        meshRef.current.material.emissiveIntensity = 0.8;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onDrag();
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    onDrop();
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Box ref={meshRef} args={[1.2, 0.3, 0.3]}>
        <meshStandardMaterial 
          color={isActive ? "#ffaa00" : "#8B4513"} 
          emissive={isActive ? "#ffaa00" : "#000000"}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </Box>
      {isSelected && (
        <Box args={[1.4, 0.5, 0.5]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
        </Box>
      )}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        RESISTOR
      </Text>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? "1kΩ - ACTIVE" : "1kΩ - OFF"}
      </Text>
    </group>
  );
}

// VR LED
function VRLED({ position, isActive, isSelected, isDragging, onSelect, onDrag, onDrop }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      if (isActive) {
        meshRef.current.material.emissive.setHex(0xff0000);
        meshRef.current.material.emissiveIntensity = 1.0;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onDrag();
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    onDrop();
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Cylinder ref={meshRef} args={[0.2, 0.2, 0.6, 8]}>
        <meshStandardMaterial 
          color={isActive ? "#ff4444" : "#FF6B6B"} 
          emissive={isActive ? "#ff0000" : "#000000"}
          emissiveIntensity={isActive ? 0.8 : 0}
        />
      </Cylinder>
      {isSelected && (
        <Cylinder args={[0.3, 0.3, 0.8, 8]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
        </Cylinder>
      )}
      <Text
        position={[0, 0.8, 0]}
        fontSize={0.25}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        LED
      </Text>
      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? "GLOWING" : "OFF"}
      </Text>
    </group>
  );
}

// VR Battery
function VRBattery({ position, isActive, isSelected, isDragging, onSelect, onDrag, onDrop }) {
  const meshRef = useRef();
  const groupRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current && !isDragging) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      if (isActive) {
        meshRef.current.material.emissive.setHex(0x444400);
        meshRef.current.material.emissiveIntensity = 0.5;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  const handlePointerDown = (e) => {
    e.stopPropagation();
    onDrag();
  };

  const handlePointerUp = (e) => {
    e.stopPropagation();
    onDrop();
  };

  return (
    <group 
      ref={groupRef}
      position={position}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      <Box ref={meshRef} args={[0.8, 0.5, 0.4]}>
        <meshStandardMaterial 
          color={isActive ? "#ffff00" : "#FFD700"} 
          emissive={isActive ? "#ffff00" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Box>
      {isSelected && (
        <Box args={[1.0, 0.7, 0.6]} position={[0, 0, 0]}>
          <meshBasicMaterial color="#00ffff" transparent opacity={0.2} />
        </Box>
      )}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.25}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        9V BATTERY
      </Text>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {isActive ? "POWERING" : "OFF"}
      </Text>
    </group>
  );
}

// VR Wire
function VRWire({ start, end, isActive, voltage }) {
  const points = [start, end];
  
  return (
    <group>
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flat())}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial 
          color={isActive ? "#00ff00" : "#00ffff"} 
          linewidth={isActive ? 8 : 3}
        />
      </line>
      {isActive && (
        <Text
          position={[
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 0.3,
            (start[2] + end[2]) / 2
          ]}
          fontSize={0.2}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {voltage.toFixed(1)}V
        </Text>
      )}
    </group>
  );
}

// VR Environment
function VREnvironment() {
  return (
    <>
      <Environment preset="night" />
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.6} />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#00ffff" />
      
      {/* VR Grid floor */}
      {Array.from({ length: 21 }, (_, i) => (
        <group key={`grid-${i}`}>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([i - 10, 0, -10, i - 10, 0, 10])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00ffff" transparent opacity={0.4} />
          </line>
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([-10, 0, i - 10, 10, 0, i - 10])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#00ffff" transparent opacity={0.4} />
          </line>
        </group>
      ))}
    </>
  );
}

// Main VR Scene
function VRScene({ 
  components, 
  setComponents, 
  selectedComponent, 
  setSelectedComponent, 
  simulationActive, 
  setSimulationActive,
  mode,
  setMode 
}) {
  const { camera, raycaster, mouse, scene } = useThree();
  const [draggingComponent, setDraggingComponent] = useState(null);
  const [dragOffset, setDragOffset] = useState([0, 0, 0]);
  
  useEffect(() => {
    camera.position.set(6, 4, 6);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const handleComponentSelect = (index) => {
    setSelectedComponent(selectedComponent === index ? null : index);
  };

  const handleComponentDrag = (index) => {
    setDraggingComponent(index);
    const component = components[index];
    setDragOffset([
      mouse.x * 10 - component.position[0],
      mouse.y * 10 - component.position[1],
      component.position[2]
    ]);
  };

  const handleComponentDrop = () => {
    if (draggingComponent !== null) {
      const newComponents = [...components];
      newComponents[draggingComponent] = {
        ...newComponents[draggingComponent],
        position: [
          mouse.x * 10 - dragOffset[0],
          mouse.y * 10 - dragOffset[1],
          newComponents[draggingComponent].position[2]
        ]
      };
      setComponents(newComponents);
    }
    setDraggingComponent(null);
  };

  const addComponent = (type) => {
    const newComponent = {
      type,
      position: [mouse.x * 10, mouse.y * 10, 0.5],
      isActive: simulationActive,
      id: Date.now()
    };
    setComponents([...components, newComponent]);
  };

  const deleteComponent = (index) => {
    if (selectedComponent === index) {
      setSelectedComponent(null);
    }
    setComponents(components.filter((_, i) => i !== index));
  };

  const connections = [
    { start: [-2, 0.5, 0], end: [0, 0.5, 0], isActive: simulationActive, voltage: 9.0 },
    { start: [0, 0.5, 0], end: [2, 0.5, 0], isActive: simulationActive, voltage: 6.0 },
    { start: [-2, 0.5, 0], end: [0, 0.5, 2], isActive: simulationActive, voltage: 9.0 },
    { start: [0, 0.5, 2], end: [2, 0.5, 2], isActive: simulationActive, voltage: 6.0 },
    { start: [2, 0.5, 0], end: [-2, 0.5, 0], isActive: simulationActive, voltage: 0.0 },
    { start: [2, 0.5, 2], end: [-2, 0.5, 0], isActive: simulationActive, voltage: 0.0 }
  ];

  return (
    <>
      <VREnvironment />
      
      {/* VR Hands */}
      <VRHand position={[-1.5, 1.5, 0]} isLeft={true} />
      <VRHand position={[1.5, 1.5, 0]} isLeft={false} />
      
      {/* Circuit Components */}
      {components.map((comp, index) => {
        const isSelected = selectedComponent === index;
        const isDragging = draggingComponent === index;
        
        switch (comp.type) {
          case 'resistor':
            return (
              <VRResistor 
                key={comp.id || index} 
                position={comp.position} 
                isActive={comp.isActive} 
                isSelected={isSelected}
                isDragging={isDragging}
                onSelect={() => handleComponentSelect(index)}
                onDrag={() => handleComponentDrag(index)}
                onDrop={handleComponentDrop}
              />
            );
          case 'led':
            return (
              <VRLED 
                key={comp.id || index} 
                position={comp.position} 
                isActive={comp.isActive} 
                isSelected={isSelected}
                isDragging={isDragging}
                onSelect={() => handleComponentSelect(index)}
                onDrag={() => handleComponentDrag(index)}
                onDrop={handleComponentDrop}
              />
            );
          case 'battery':
            return (
              <VRBattery 
                key={comp.id || index} 
                position={comp.position} 
                isActive={comp.isActive} 
                isSelected={isSelected}
                isDragging={isDragging}
                onSelect={() => handleComponentSelect(index)}
                onDrag={() => handleComponentDrag(index)}
                onDrop={handleComponentDrop}
              />
            );
          default:
            return null;
        }
      })}
      
      {/* Connections */}
      {connections.map((conn, index) => (
        <VRWire
          key={index}
          start={conn.start}
          end={conn.end}
          isActive={conn.isActive}
          voltage={conn.voltage}
        />
      ))}
      
      {/* VR UI Elements */}
      <Text
        position={[0, 4, -4]}
        fontSize={0.6}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        VR CIRCUIT LEARNING MODULE
      </Text>
      
      <Text
        position={[0, 3.5, -4]}
        fontSize={0.25}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {mode === 'build' ? 'Build Mode - Click and drag components' : 'Simulation Mode - Watch the circuit work'}
      </Text>
    </>
  );
}

function DirectVRSimulation({ isVisible, onClose }) {
  const [components, setComponents] = useState([
    { type: 'battery', position: [-2, 0.5, 0], isActive: true, id: 1 },
    { type: 'resistor', position: [0, 0.5, 0], isActive: true, id: 2 },
    { type: 'led', position: [2, 0.5, 0], isActive: true, id: 3 },
    { type: 'resistor', position: [0, 0.5, 2], isActive: true, id: 4 },
    { type: 'led', position: [2, 0.5, 2], isActive: true, id: 5 }
  ]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [simulationActive, setSimulationActive] = useState(true);
  const [mode, setMode] = useState('simulation'); // 'simulation' or 'build'
  
  // Tutorial states
  const [showTutorial, setShowTutorial] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [currentTutorial, setCurrentTutorial] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [tutorialProgress, setTutorialProgress] = useState(0);

  if (!isVisible) return null;

  const addComponent = (type) => {
    const newComponent = {
      type,
      position: [Math.random() * 4 - 2, 0.5, Math.random() * 4 - 2],
      isActive: simulationActive,
      id: Date.now()
    };
    setComponents([...components, newComponent]);
  };

  const deleteSelectedComponent = () => {
    if (selectedComponent !== null) {
      setComponents(components.filter((_, i) => i !== selectedComponent));
      setSelectedComponent(null);
    }
  };

  const clearAllComponents = () => {
    setComponents([]);
    setSelectedComponent(null);
  };

  // Tutorial functions
  const startTutorial = (tutorialKey) => {
    console.log('Starting tutorial:', tutorialKey);
    const tutorial = circuitTutorials[tutorialKey];
    console.log('Tutorial data:', tutorial);
    setCurrentTutorial(tutorial);
    setCurrentStep(0);
    setTutorialProgress(0);
    setShowTutorial(false);
    setMode('build');
    setComponents([]); // Clear existing components
    
    // Add first component immediately
    if (tutorial && tutorial.steps[0] && tutorial.steps[0].component) {
      setTimeout(() => {
        addComponentAtPosition(tutorial.steps[0].component, tutorial.steps[0].position);
        setTutorialProgress((1 / tutorial.steps.length) * 100);
      }, 100);
    }
  };

  const nextStep = () => {
    if (currentTutorial && currentStep < currentTutorial.steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      setTutorialProgress((newStep / currentTutorial.steps.length) * 100);
      
      // Auto-add component for current step
      const stepData = currentTutorial.steps[newStep];
      if (stepData.component) {
        addComponentAtPosition(stepData.component, stepData.position);
      }
    }
  };


  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      setTutorialProgress((newStep / currentTutorial.steps.length) * 100);
    }
  };

  const completeTutorial = () => {
    setCurrentTutorial(null);
    setCurrentStep(0);
    setTutorialProgress(0);
    setMode('simulation');
    setSimulationActive(true);
  };

  const addComponentAtPosition = (type, position) => {
    const newComponent = {
      type,
      position,
      isActive: simulationActive,
      id: Date.now() + Math.random()
    };
    setComponents(prev => [...prev, newComponent]);
  };

  return (
    <VRContainer>
      <VRUI>
        <VRControls>
          <VRButton onClick={onClose}>
            EXIT VR
          </VRButton>
          <VRButton 
            onClick={() => setShowTutorial(true)}
            style={{ 
              background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
              borderColor: '#ff6b6b',
              color: '#ffffff'
            }}
          >
            📚 TUTORIALS
          </VRButton>
          <VRButton 
            onClick={() => startTutorial('simpleLED')}
            style={{ 
              background: 'linear-gradient(135deg, #00ff00 0%, #00cc00 100%)',
              borderColor: '#00ff00',
              color: '#000000'
            }}
          >
            🚀 QUICK START
          </VRButton>
          <VRButton 
            onClick={() => setMode(mode === 'simulation' ? 'build' : 'simulation')}
            style={{ 
              background: mode === 'build' ? 'rgba(0, 255, 0, 0.3)' : 'rgba(0, 255, 255, 0.2)',
              borderColor: mode === 'build' ? '#00ff00' : '#00ffff'
            }}
          >
            {mode === 'simulation' ? 'BUILD MODE' : 'SIMULATION MODE'}
          </VRButton>
          <VRButton 
            onClick={() => setSimulationActive(!simulationActive)}
            style={{ 
              background: simulationActive ? 'rgba(0, 255, 0, 0.3)' : 'rgba(255, 0, 0, 0.2)',
              borderColor: simulationActive ? '#00ff00' : '#ff0000'
            }}
          >
            {simulationActive ? 'SIMULATION ON' : 'SIMULATION OFF'}
          </VRButton>
        </VRControls>

        <ComponentPalette>
          <PaletteTitle>Components</PaletteTitle>
          <PaletteItem onClick={() => addComponent('battery')}>
            🔋 Battery
          </PaletteItem>
          <PaletteItem onClick={() => addComponent('resistor')}>
            ⚡ Resistor
          </PaletteItem>
          <PaletteItem onClick={() => addComponent('led')}>
            💡 LED
          </PaletteItem>
        </ComponentPalette>

        <VRControlPanel>
          <ControlTitle>VR Controls</ControlTitle>
          <ControlButton 
            onClick={() => setMode('simulation')}
            active={mode === 'simulation'}
          >
            🎮 Simulation Mode
          </ControlButton>
          <ControlButton 
            onClick={() => setMode('build')}
            active={mode === 'build'}
          >
            🔧 Build Mode
          </ControlButton>
          <ControlButton onClick={() => setSimulationActive(!simulationActive)}>
            {simulationActive ? '⏸️ Pause Simulation' : '▶️ Start Simulation'}
          </ControlButton>
          <ControlButton onClick={deleteSelectedComponent}>
            🗑️ Delete Selected
          </ControlButton>
          <ControlButton onClick={clearAllComponents}>
            🧹 Clear All
          </ControlButton>
        </VRControlPanel>

        <VRInfo>
          <VRTitle>VR Circuit Learning</VRTitle>
          <VRDescription>
            <strong>Interactive VR Electronics Education!</strong>
          </VRDescription>
          <VRDescription>
            • <strong>📚 Tutorials:</strong> Step-by-step circuit assembly guides
          </VRDescription>
          <VRDescription>
            • <strong>Click & Drag:</strong> Move components around the VR space
          </VRDescription>
          <VRDescription>
            • <strong>Component Palette:</strong> Add new components from the right panel
          </VRDescription>
          <VRDescription>
            • <strong>Build Mode:</strong> Assemble circuits by dragging components
          </VRDescription>
          <VRDescription>
            • <strong>Simulation Mode:</strong> Watch your circuit work in real-time
          </VRDescription>
          <VRDescription>
            • <strong>Mouse Controls:</strong> Look around, zoom, and interact
          </VRDescription>
        </VRInfo>

        <VRStatus>
          🥽 VR ACTIVE | Mode: {mode.toUpperCase()} | Components: {components.length} | Simulation: {simulationActive ? 'ON' : 'OFF'} | Tutorial: {currentTutorial ? currentTutorial.name : 'None'}
        </VRStatus>

        {/* Tutorial Components */}
        <TutorialComponent
          isVisible={showTutorial}
          onClose={() => setShowTutorial(false)}
          onStartTutorial={startTutorial}
          selectedTutorial={selectedTutorial}
          setSelectedTutorial={setSelectedTutorial}
        />

        <InstructionPanelComponent
          tutorial={currentTutorial}
          currentStep={currentStep}
          progress={tutorialProgress}
          onNextStep={nextStep}
          onPrevStep={prevStep}
          onCompleteTutorial={completeTutorial}
        />
      </VRUI>
      
      <Canvas camera={{ position: [6, 4, 6], fov: 75 }}>
        <VRScene 
          components={components}
          setComponents={setComponents}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          simulationActive={simulationActive}
          setSimulationActive={setSimulationActive}
          mode={mode}
          setMode={setMode}
        />
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          enableDamping={true}
          dampingFactor={0.05}
        />
      </Canvas>
    </VRContainer>
  );
}

export default DirectVRSimulation;
