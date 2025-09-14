import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Sphere, Environment, PresentationControls } from '@react-three/drei';
import styled from 'styled-components';
import { useCircuit } from '../context/CircuitContext';
import { loadDemoCircuit } from '../utils/demoCircuits';

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
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: auto;
`;

const VRButton = styled.button`
  padding: 15px 20px;
  background: rgba(0, 255, 255, 0.2);
  border: 2px solid #00ffff;
  border-radius: 10px;
  color: #00ffff;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  
  &:hover {
    background: rgba(0, 255, 255, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(0, 255, 255, 0.3);
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
  max-width: 300px;
  backdrop-filter: blur(10px);
`;

const VRTitle = styled.h2`
  color: #00ffff;
  margin-bottom: 15px;
  font-size: 18px;
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
  background: rgba(0, 255, 255, 0.1);
  border: 1px solid #00ffff;
  padding: 10px 20px;
  border-radius: 25px;
  color: #00ffff;
  font-weight: 600;
  z-index: 20;
  backdrop-filter: blur(10px);
`;

// VR Hand/Controller representation
function VRHand({ position, isLeft = false }) {
  const handRef = useRef();
  
  useFrame((state) => {
    if (handRef.current) {
      // Simulate hand movement
      handRef.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      handRef.current.position.y = position[1] + Math.cos(state.clock.elapsedTime * 1.5) * 0.05;
      handRef.current.position.z = position[2] + Math.sin(state.clock.elapsedTime * 3) * 0.08;
    }
  });

  return (
    <group ref={handRef}>
      <Box args={[0.1, 0.2, 0.05]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#333333" emissive="#00ffff" emissiveIntensity={0.2} />
      </Box>
      <Box args={[0.05, 0.1, 0.02]} position={[0, 0.15, 0]}>
        <meshStandardMaterial color="#666666" emissive="#00ffff" emissiveIntensity={0.1} />
      </Box>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.1}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        {isLeft ? 'L' : 'R'}
      </Text>
    </group>
  );
}

// VR Component representations
function VRResistor({ position, isActive, isHovered }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
      if (isActive) {
        meshRef.current.material.emissive.setHex(0x444400);
        meshRef.current.material.emissiveIntensity = 0.5;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.8, 0.2, 0.2]}>
        <meshStandardMaterial 
          color={isActive ? "#ffaa00" : "#8B4513"} 
          emissive={isActive ? "#ffaa00" : "#000000"}
          emissiveIntensity={isActive ? 0.3 : 0}
        />
      </Box>
      <Text
        position={[0, 0.4, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        R
      </Text>
      {isHovered && (
        <Text
          position={[0, -0.4, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          1kΩ
        </Text>
      )}
    </group>
  );
}

function VRLED({ position, isActive, isHovered }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      if (isActive) {
        meshRef.current.material.emissive.setHex(0xff0000);
        meshRef.current.material.emissiveIntensity = 0.8;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group position={position}>
      <Cylinder ref={meshRef} args={[0.15, 0.15, 0.4, 8]}>
        <meshStandardMaterial 
          color={isActive ? "#ff4444" : "#FF6B6B"} 
          emissive={isActive ? "#ff0000" : "#000000"}
          emissiveIntensity={isActive ? 0.5 : 0}
        />
      </Cylinder>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        LED
      </Text>
      {isHovered && (
        <Text
          position={[0, -0.5, 0]}
          fontSize={0.15}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {isActive ? "ON" : "OFF"}
        </Text>
      )}
    </group>
  );
}

function VRBattery({ position, isActive }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      if (isActive) {
        meshRef.current.material.emissive.setHex(0x444400);
        meshRef.current.material.emissiveIntensity = 0.3;
      } else {
        meshRef.current.material.emissive.setHex(0x000000);
        meshRef.current.material.emissiveIntensity = 0;
      }
    }
  });

  return (
    <group position={position}>
      <Box ref={meshRef} args={[0.6, 0.4, 0.3]}>
        <meshStandardMaterial 
          color={isActive ? "#ffff00" : "#FFD700"} 
          emissive={isActive ? "#ffff00" : "#000000"}
          emissiveIntensity={isActive ? 0.2 : 0}
        />
      </Box>
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        9V
      </Text>
    </group>
  );
}

// VR Wire connections
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
          linewidth={isActive ? 5 : 2}
        />
      </line>
      {isActive && (
        <Text
          position={[
            (start[0] + end[0]) / 2,
            (start[1] + end[1]) / 2 + 0.2,
            (start[2] + end[2]) / 2
          ]}
          fontSize={0.15}
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
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#00ffff" />
      
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
            <lineBasicMaterial color="#00ffff" transparent opacity={0.3} />
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
            <lineBasicMaterial color="#00ffff" transparent opacity={0.3} />
          </line>
        </group>
      ))}
    </>
  );
}

// Main VR Scene
function VRScene() {
  const { components, connections, isSimulating, simulationData } = useCircuit();
  const [hoveredComponent, setHoveredComponent] = useState(null);
  const [vrMode, setVrMode] = useState('demo'); // 'demo', 'interactive', 'presentation'
  
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(5, 3, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const getVRComponent = (component) => {
    const position = [
      component.position.x / 50 - 2,
      0.5,
      component.position.y / 50 - 2
    ];
    
    const simData = simulationData[component.id] || {};
    const isActive = simData.isActive || false;
    const isHovered = hoveredComponent === component.id;
    
    switch (component.type) {
      case 'resistor':
        return <VRResistor key={component.id} position={position} isActive={isActive} isHovered={isHovered} />;
      case 'led':
        return <VRLED key={component.id} position={position} isActive={isActive} isHovered={isHovered} />;
      case 'battery':
        return <VRBattery key={component.id} position={position} isActive={isActive} />;
      default:
        return null;
    }
  };

  const getVRConnection = (connection) => {
    const fromComponent = components.find(c => c.id === connection.fromComponent);
    const toComponent = components.find(c => c.id === connection.toComponent);
    
    if (!fromComponent || !toComponent) return null;
    
    const start = [
      fromComponent.position.x / 50 - 2,
      0.5,
      fromComponent.position.y / 50 - 2
    ];
    
    const end = [
      toComponent.position.x / 50 - 2,
      0.5,
      toComponent.position.y / 50 - 2
    ];
    
    const simData = simulationData[connection.id] || {};
    const isActive = simData.voltage > 0.1;
    
    return (
      <VRWire
        key={connection.id}
        start={start}
        end={end}
        isActive={isActive}
        voltage={simData.voltage || 0}
      />
    );
  };

  return (
    <>
      <VREnvironment />
      
      {/* VR Hands */}
      <VRHand position={[-1, 1, 0]} isLeft={true} />
      <VRHand position={[1, 1, 0]} isLeft={false} />
      
      {/* Circuit Components */}
      {components.map(getVRComponent)}
      
      {/* Connections */}
      {connections.map(getVRConnection)}
      
      {/* VR UI Elements */}
      <Text
        position={[0, 3, -3]}
        fontSize={0.5}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        VR Circuit Learning Module
      </Text>
      
      <Text
        position={[0, 2.5, -3]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        Immersive Electronics Education
      </Text>
    </>
  );
}

function VRPresentation({ isVisible, onClose }) {
  const [currentMode, setCurrentMode] = useState('demo');
  const { addComponent, addConnection, clearCircuit, startSimulation } = useCircuit();
  
  // Load VR demo circuit when entering VR mode
  useEffect(() => {
    if (isVisible) {
      clearCircuit();
      loadDemoCircuit('vrDemo', addComponent, addConnection);
      startSimulation();
    }
  }, [isVisible, addComponent, addConnection, clearCircuit, startSimulation]);
  
  if (!isVisible) return null;

  const modes = {
    demo: {
      title: "VR Demo Mode",
      description: "Experience how the circuit learning module works in virtual reality. Use mouse to look around and explore the 3D environment.",
      instructions: [
        "• Mouse: Look around the VR environment",
        "• Scroll: Zoom in/out",
        "• Right-click + drag: Move around",
        "• Watch the glowing components and animated connections"
      ]
    },
    interactive: {
      title: "VR Interactive Mode",
      description: "Simulate VR hand tracking and component manipulation. See how users would interact with components using VR controllers.",
      instructions: [
        "• Virtual hands simulate VR controllers",
        "• Components respond to hand proximity",
        "• Hover effects show component details",
        "• Real-time simulation with visual feedback"
      ]
    },
    presentation: {
      title: "VR Presentation Mode",
      description: "Professional presentation view showing the full potential of VR-based circuit learning and education.",
      instructions: [
        "• Optimized for presentations and demos",
        "• Smooth camera movements",
        "• Highlighted key features",
        "• Professional VR environment"
      ]
    }
  };

  const currentModeData = modes[currentMode];

  return (
    <VRContainer>
      <VRUI>
        <VRControls>
          <VRButton onClick={() => setCurrentMode('demo')} style={{ 
            background: currentMode === 'demo' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.2)' 
          }}>
            Demo Mode
          </VRButton>
          <VRButton onClick={() => setCurrentMode('interactive')} style={{ 
            background: currentMode === 'interactive' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.2)' 
          }}>
            Interactive Mode
          </VRButton>
          <VRButton onClick={() => setCurrentMode('presentation')} style={{ 
            background: currentMode === 'presentation' ? 'rgba(0, 255, 255, 0.3)' : 'rgba(0, 255, 255, 0.2)' 
          }}>
            Presentation Mode
          </VRButton>
          <VRButton onClick={onClose} style={{ 
            background: 'rgba(255, 0, 0, 0.2)', 
            borderColor: '#ff0000', 
            color: '#ff0000' 
          }}>
            Exit VR
          </VRButton>
        </VRControls>

        <VRInfo>
          <VRTitle>{currentModeData.title}</VRTitle>
          <VRDescription>{currentModeData.description}</VRDescription>
          <div>
            {currentModeData.instructions.map((instruction, index) => (
              <VRDescription key={index}>{instruction}</VRDescription>
            ))}
          </div>
        </VRInfo>

        <VRStatus>
          VR Mode: {currentMode.toUpperCase()} | Status: {isVisible ? 'ACTIVE' : 'INACTIVE'}
        </VRStatus>
      </VRUI>
      
      <Canvas camera={{ position: [5, 3, 5], fov: 75 }}>
        <VRScene />
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            enableDamping={true}
            dampingFactor={0.05}
          />
        </PresentationControls>
      </Canvas>
    </VRContainer>
  );
}

export default VRPresentation;
