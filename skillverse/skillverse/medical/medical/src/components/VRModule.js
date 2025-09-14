import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw, Hand, Stethoscope, Play, Pause } from 'lucide-react';
import LungsModel from './LungsModel';
import InstructionPanel from './InstructionPanel';

const VRContainer = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #000;
  overflow: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
`;

const UIOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 1000;
  box-sizing: border-box;
`;

const TopBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  pointer-events: auto;
  width: 100%;
  box-sizing: border-box;
`;

const Title = styled.h1`
  color: white;
  font-size: clamp(1rem, 3vw, 1.5rem);
  font-weight: 600;
  margin: 0;
  flex-shrink: 0;
`;

const ControlButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const ControlButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  white-space: nowrap;
  min-width: fit-content;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const CloseButton = styled(ControlButton)`
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.3);
  
  &:hover {
    background: rgba(239, 68, 68, 0.3);
  }
`;



const HandTrackingIndicator = styled(motion.div)`
  position: absolute;
  top: 50%;
  right: 2rem;
  transform: translateY(-50%);
  background: rgba(34, 197, 94, 0.2);
  border: 2px solid rgba(34, 197, 94, 0.5);
  color: #22c55e;
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  pointer-events: auto;
`;

const VRScene = styled.div`
  width: 100vw;
  height: 100vh;
  position: relative;
  box-sizing: border-box;
`;


function VRModule({ onReturnHome }) {
  const [handTrackingActive, setHandTrackingActive] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);
  const [currentDisease, setCurrentDisease] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const medicalProcedures = {
    'healthy': [
      "Perform initial patient assessment and vital signs check",
      "Examine the patient's breathing pattern and chest movement",
      "Listen to lung sounds with stethoscope for any abnormalities",
      "Check oxygen saturation levels and respiratory rate",
      "Document findings and provide health recommendations"
    ],
    'pneumonia': [
      "Assess patient's breathing difficulty and chest pain",
      "Listen for crackling sounds in the lungs (rales)",
      "Check for fever, chills, and productive cough",
      "Order chest X-ray to confirm lung inflammation",
      "Administer appropriate antibiotics and oxygen therapy",
      "Monitor patient's response to treatment"
    ],
    'asthma': [
      "Assess breathing difficulty and wheezing sounds",
      "Check peak flow measurements and oxygen saturation",
      "Listen for expiratory wheezing and prolonged expiration",
      "Administer bronchodilator medication (inhaler)",
      "Monitor response and adjust treatment as needed",
      "Provide asthma management education"
    ],
    'copd': [
      "Assess chronic cough and shortness of breath",
      "Listen for decreased breath sounds and wheezing",
      "Check oxygen saturation and arterial blood gases",
      "Evaluate smoking history and exposure to irritants",
      "Administer bronchodilators and oxygen therapy",
      "Plan long-term management and smoking cessation"
    ],
    'tuberculosis': [
      "Assess persistent cough, fever, and weight loss",
      "Listen for abnormal lung sounds and chest pain",
      "Order sputum culture and chest X-ray",
      "Check for night sweats and fatigue",
      "Initiate anti-tuberculosis medication regimen",
      "Implement infection control measures"
    ],
    'cancer': [
      "Assess persistent cough, chest pain, and weight loss",
      "Listen for abnormal breath sounds and wheezing",
      "Order CT scan and biopsy for definitive diagnosis",
      "Check for hemoptysis and breathing difficulties",
      "Consult with oncology team for treatment planning",
      "Provide supportive care and symptom management"
    ]
  };

  const resetModule = () => {
    setSelectedComponent(null);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const toggleHandTracking = () => {
    setHandTrackingActive(!handTrackingActive);
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const handleDiseaseChange = (disease) => {
    setCurrentDisease(disease);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStepSelect = (step) => {
    setCurrentStep(step);
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const currentSteps = currentDisease ? medicalProcedures[currentDisease.name.toLowerCase().replace(/\s+/g, '')] || medicalProcedures['healthy'] : medicalProcedures['healthy'];


  return (
    <VRContainer>
      <VRScene>
        <LungsModel 
          selectedComponent={selectedComponent}
          onComponentSelect={setSelectedComponent}
          handTrackingActive={handTrackingActive}
          currentDisease={currentDisease}
          onDiseaseChange={handleDiseaseChange}
        />
      </VRScene>

      <UIOverlay>
        <TopBar>
          <Title>VR Lung Disease Simulator</Title>
          <ControlButtons>
            <ControlButton
              onClick={toggleInstructions}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Stethoscope size={20} />
              Medical Procedures
            </ControlButton>
            <ControlButton
              onClick={toggleHandTracking}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Hand size={20} />
              {handTrackingActive ? 'Hand Tracking ON' : 'Hand Tracking OFF'}
            </ControlButton>
            <ControlButton
              onClick={resetModule}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RotateCcw size={20} />
              Reset
            </ControlButton>
            <CloseButton
              onClick={onReturnHome}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X size={20} />
              Exit
            </CloseButton>
          </ControlButtons>
        </TopBar>


        {handTrackingActive && (
          <HandTrackingIndicator
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <Hand size={20} />
            Hand Tracking Active
          </HandTrackingIndicator>
        )}

        <AnimatePresence>
          {showInstructions && (
            <InstructionPanel
              steps={currentSteps}
              currentStep={currentStep}
              onClose={() => setShowInstructions(false)}
              onStepSelect={handleStepSelect}
              currentDisease={currentDisease}
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>
      </UIOverlay>
    </VRContainer>
  );
}

export default VRModule;
