import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Html, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

// Lung component with interactive parts
function Lung({ 
  position, 
  rotation, 
  color, 
  label, 
  onSelect, 
  isSelected, 
  isLeft = true, 
  breathingAnimation = true, 
  showLabels = true,
  diseaseEffects = {},
  diseaseColor = '#4ecdc4'
}) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      
      // Breathing animation with disease effects
      if (breathingAnimation) {
        let breathingScale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        
        // Disease effects on breathing
        if (diseaseEffects.constriction) {
          breathingScale *= 0.7; // Reduced breathing capacity
        }
        if (diseaseEffects.inflammation) {
          breathingScale += Math.sin(state.clock.elapsedTime * 4) * 0.05; // Irregular breathing
        }
        
        meshRef.current.scale.y = breathingScale;
      }
      
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  const lungGeometry = useMemo(() => {
    // Create a more realistic lung shape
    const geometry = new THREE.SphereGeometry(1, 32, 32);
    geometry.scale(0.8, 1.2, 0.6);
    
    // Add some asymmetry for realism
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < vertices.length; i += 3) {
      if (isLeft) {
        vertices[i] *= 0.9; // Make left lung slightly smaller
      }
      // Add some organic variation
      vertices[i + 1] += Math.sin(vertices[i] * 2) * 0.1;
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.computeVertexNormals();
    
    return geometry;
  }, [isLeft]);

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        geometry={lungGeometry}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <meshPhongMaterial
          color={isSelected ? '#ff6b6b' : hovered ? '#ff8e8e' : diseaseColor}
          transparent
          opacity={diseaseEffects.opacity || 0.8}
          shininess={diseaseEffects.damage ? 50 : 100}
        />
      </mesh>
      
      {/* Bronchial tree structure */}
      <BronchialTree isLeft={isLeft} />
      
      {/* Label */}
      {showLabels && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      )}
    </group>
  );
}

// Bronchial tree component
function BronchialTree({ isLeft }) {
  const branchGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8);
    return geometry;
  }, []);

  const branches = useMemo(() => {
    const branchPositions = [];
    const branchRotations = [];
    
    // Main bronchus
    branchPositions.push([0, 0, 0]);
    branchRotations.push([0, 0, 0]);
    
    // Secondary bronchi
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      branchPositions.push([
        Math.cos(angle) * 0.3,
        -0.5 + i * 0.3,
        Math.sin(angle) * 0.3
      ]);
      branchRotations.push([0, angle, 0]);
    }
    
    return { positions: branchPositions, rotations: branchRotations };
  }, []);

  return (
    <group>
      {branches.positions.map((pos, index) => (
        <mesh
          key={index}
          position={pos}
          rotation={branches.rotations[index]}
          geometry={branchGeometry}
        >
          <meshPhongMaterial color="#8B4513" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

// Trachea component
function Trachea({ onSelect, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={[0, 2, 0]}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[0.15, 0.2, 2, 16]} />
        <meshPhongMaterial
          color={isSelected ? '#ff6b6b' : hovered ? '#ff8e8e' : '#e0e0e0'}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Trachea
      </Text>
    </group>
  );
}

// Diaphragm component
function Diaphragm({ onSelect, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.05);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={[0, -2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <cylinderGeometry args={[2, 2.5, 0.2, 32]} />
        <meshPhongMaterial
          color={isSelected ? '#ff6b6b' : hovered ? '#ff8e8e' : '#ffd700'}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      <Text
        position={[0, 0, 0.3]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 2, 0, 0]}
      >
        Diaphragm
      </Text>
    </group>
  );
}

// Heart component (for context)
function Heart({ onSelect, isSelected }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      if (hovered || isSelected) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
      }
    }
  });

  return (
    <group position={[-0.5, 0, 0.3]}>
      <mesh
        ref={meshRef}
        onClick={onSelect}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshPhongMaterial
          color={isSelected ? '#ff6b6b' : hovered ? '#ff8e8e' : '#ff4757'}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Heart
      </Text>
    </group>
  );
}

// Main Lungs Model component
function LungsModel({ 
  selectedComponent, 
  onComponentSelect, 
  handTrackingActive, 
  currentDisease, 
  onDiseaseChange 
}) {
  const [breathingAnimation, setBreathingAnimation] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [surgicalMode, setSurgicalMode] = useState(false);
  const [diseaseEffects, setDiseaseEffects] = useState({});

  const diseases = {
    'healthy': { name: 'Healthy Lungs', color: '#4ecdc4', effects: {} },
    'pneumonia': { 
      name: 'Pneumonia', 
      color: '#ff6b6b', 
      effects: { inflammation: true, fluid: true, opacity: 0.6 } 
    },
    'asthma': { 
      name: 'Asthma', 
      color: '#ffa500', 
      effects: { constriction: true, wheezing: true, opacity: 0.7 } 
    },
    'copd': { 
      name: 'COPD', 
      color: '#8b4513', 
      effects: { damage: true, scarring: true, opacity: 0.5 } 
    },
    'tuberculosis': { 
      name: 'Tuberculosis', 
      color: '#800080', 
      effects: { lesions: true, cavities: true, opacity: 0.4 } 
    },
    'cancer': { 
      name: 'Lung Cancer', 
      color: '#dc143c', 
      effects: { tumors: true, masses: true, opacity: 0.3 } 
    }
  };

  const handleComponentClick = (componentId) => {
    onComponentSelect(componentId === selectedComponent ? null : componentId);
  };

  const toggleBreathing = () => {
    setBreathingAnimation(!breathingAnimation);
  };

  const toggleLabels = () => {
    setShowLabels(!showLabels);
  };

  const toggleSurgicalMode = () => {
    setSurgicalMode(!surgicalMode);
  };

  const handleDiseaseChange = (diseaseKey) => {
    const disease = diseases[diseaseKey];
    setDiseaseEffects(disease.effects);
    onDiseaseChange(disease);
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      shadows
      style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />

      <Environment preset="sunset" />

      {/* Main anatomical structures */}
      <Lung
        position={[-1.2, 0, 0]}
        rotation={[0, 0, 0]}
        color="#4ecdc4"
        label="Left Lung"
        onSelect={() => handleComponentClick('leftLung')}
        isSelected={selectedComponent === 'leftLung'}
        isLeft={true}
        breathingAnimation={breathingAnimation}
        showLabels={showLabels}
        diseaseEffects={diseaseEffects}
        diseaseColor={currentDisease?.color || '#4ecdc4'}
      />

      <Lung
        position={[1.2, 0, 0]}
        rotation={[0, 0, 0]}
        color="#45b7d1"
        label="Right Lung"
        onSelect={() => handleComponentClick('rightLung')}
        isSelected={selectedComponent === 'rightLung'}
        isLeft={false}
        breathingAnimation={breathingAnimation}
        showLabels={showLabels}
        diseaseEffects={diseaseEffects}
        diseaseColor={currentDisease?.color || '#45b7d1'}
      />

      <Trachea
        onSelect={() => handleComponentClick('trachea')}
        isSelected={selectedComponent === 'trachea'}
      />

      <Diaphragm
        onSelect={() => handleComponentClick('diaphragm')}
        isSelected={selectedComponent === 'diaphragm'}
      />

      <Heart
        onSelect={() => handleComponentClick('heart')}
        isSelected={selectedComponent === 'heart'}
      />

      {/* Interactive controls */}
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        autoRotate={false}
      />

      <ContactShadows
        rotation-x={Math.PI / 2}
        position={[0, -3, 0]}
        opacity={0.25}
        width={10}
        height={10}
        blur={1.5}
        far={4}
      />

        {/* Disease Simulation Controls */}
        <Html position={[3, 2, 0]}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.9)',
            backdropFilter: 'blur(15px)',
            padding: '1.5rem',
            borderRadius: '15px',
            color: 'white',
            minWidth: '280px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#60a5fa', textAlign: 'center' }}>
              🫁 Disease Simulation
            </h4>
            
            {/* Disease Selector */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.9rem', color: '#93c5fd', marginBottom: '0.5rem', display: 'block' }}>
                Select Disease Condition:
              </label>
              <select
                onChange={(e) => handleDiseaseChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  borderRadius: '6px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem'
                }}
              >
                {Object.entries(diseases).map(([key, disease]) => (
                  <option key={key} value={key} style={{ background: '#1a1a1a', color: 'white' }}>
                    {disease.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Current Disease Info */}
            {currentDisease && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem',
                marginBottom: '1rem'
              }}>
                <div style={{ color: '#ef4444', fontWeight: '600', fontSize: '0.9rem' }}>
                  Current: {currentDisease.name}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                onClick={toggleBreathing}
                style={{
                  background: breathingAnimation ? 'linear-gradient(45deg, #22c55e, #16a34a)' : 'rgba(255, 255, 255, 0.1)',
                  border: breathingAnimation ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {breathingAnimation ? '🫁 Breathing Animation ON' : '⏸️ Breathing Animation OFF'}
              </button>
              <button
                onClick={toggleLabels}
                style={{
                  background: showLabels ? 'linear-gradient(45deg, #3b82f6, #1d4ed8)' : 'rgba(255, 255, 255, 0.1)',
                  border: showLabels ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {showLabels ? '🏷️ Anatomical Labels ON' : '🏷️ Anatomical Labels OFF'}
              </button>
              <button
                onClick={toggleSurgicalMode}
                style={{
                  background: surgicalMode ? 'linear-gradient(45deg, #ef4444, #dc2626)' : 'rgba(255, 255, 255, 0.1)',
                  border: surgicalMode ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                {surgicalMode ? '⚕️ Surgical Practice Mode ON' : '⚕️ Surgical Practice Mode OFF'}
              </button>
            </div>
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              background: 'rgba(59, 130, 246, 0.1)', 
              borderRadius: '8px',
              fontSize: '0.85rem',
              textAlign: 'center',
              color: '#93c5fd'
            }}>
              💡 Click on lung structures to examine disease effects
            </div>
          </div>
        </Html>

        {/* Hand tracking indicators */}
        {handTrackingActive && (
          <>
            <Html position={[2, 2, 0]}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid rgba(34, 197, 94, 0.5)',
                color: '#22c55e',
                padding: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: '600'
              }}>
                Hand Tracking Active
              </div>
            </Html>
          </>
        )}
    </Canvas>
  );
}

export default LungsModel;
