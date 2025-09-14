import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { X, Play, CheckCircle, AlertTriangle, Stethoscope, Syringe, Heart } from 'lucide-react';

const PanelContainer = styled(motion.div)`
  position: absolute;
  top: 60px;
  right: 0;
  width: min(400px, 30vw);
  height: calc(100vh - 60px);
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  overflow-y: auto;
  pointer-events: auto;
  z-index: 1001;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const Title = styled.h2`
  color: white;
  font-size: clamp(1rem, 2.5vw, 1.5rem);
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CloseButton = styled(motion.button)`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
`;

const DiseaseInfo = styled.div`
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const DiseaseTitle = styled.h3`
  color: #ef4444;
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const DiseaseDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
`;

const DiseaseSymptoms = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SymptomTag = styled.span`
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StepItem = styled(motion.div)`
  background: ${props => props.isActive ? 'rgba(79, 70, 229, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  border: 1px solid ${props => props.isActive ? 'rgba(79, 70, 229, 0.5)' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${props => props.isActive ? 'rgba(79, 70, 229, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
    transform: translateX(5px);
  }
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const StepNumber = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.isCompleted ? '#22c55e' : props.isActive ? '#4f46e5' : 'rgba(255, 255, 255, 0.2)'};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
`;

const StepTitle = styled.h3`
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const StepDescription = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  margin-left: 3rem;
`;

const StepIcon = styled.div`
  color: ${props => props.isActive ? '#4f46e5' : 'rgba(255, 255, 255, 0.5)'};
  margin-right: 0.5rem;
`;

const ProgressIndicator = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, #4f46e5, #7c3aed);
  border-radius: 0 2px 2px 0;
  opacity: ${props => props.isActive ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const QuickActions = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const ActionButton = styled(motion.button)`
  width: 100%;
  background: ${props => props.primary ? 'linear-gradient(45deg, #4f46e5, #7c3aed)' : 'rgba(255, 255, 255, 0.1)'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid rgba(255, 255, 255, 0.2)'};
  padding: 1rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.primary ? '0 6px 20px rgba(79, 70, 229, 0.4)' : '0 6px 20px rgba(0, 0, 0, 0.2)'};
  }
`;

const TipsSection = styled.div`
  margin-top: 2rem;
  padding: 1.5rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 12px;
`;

const TipsTitle = styled.h4`
  color: #22c55e;
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TipItem = styled.div`
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
  
  &:before {
    content: '•';
    color: #22c55e;
    position: absolute;
    left: 0;
  }
`;

function InstructionPanel({ 
  steps, 
  currentStep, 
  onClose, 
  onStepSelect, 
  currentDisease, 
  isPlaying, 
  onPlayPause, 
  onRestart 
}) {
  const completedSteps = currentStep;
  const totalSteps = steps.length;

  const handleStepClick = (stepIndex) => {
    onStepSelect(stepIndex);
  };

  const getStepIcon = (stepIndex) => {
    const step = steps[stepIndex];
    if (step.includes('Examine') || step.includes('Inspect')) return <Stethoscope size={16} />;
    if (step.includes('Inject') || step.includes('Medication')) return <Syringe size={16} />;
    if (step.includes('Monitor') || step.includes('Vital')) return <Heart size={16} />;
    return <AlertTriangle size={16} />;
  };

  return (
    <PanelContainer
      initial={{ x: 400 }}
      animate={{ x: 0 }}
      exit={{ x: 400 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <Header>
        <Title>
          <Stethoscope size={20} />
          Medical Procedure Guide
        </Title>
        <CloseButton
          onClick={onClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} />
        </CloseButton>
      </Header>

      {currentDisease && (
        <DiseaseInfo>
          <DiseaseTitle>
            <AlertTriangle size={16} />
            {currentDisease.name}
          </DiseaseTitle>
          <DiseaseDescription>{currentDisease.description}</DiseaseDescription>
          <DiseaseSymptoms>
            {currentDisease.symptoms.map((symptom, index) => (
              <SymptomTag key={index}>{symptom}</SymptomTag>
            ))}
          </DiseaseSymptoms>
        </DiseaseInfo>
      )}

      <StepList>
        {steps.map((step, index) => (
          <StepItem
            key={index}
            isActive={index === currentStep}
            onClick={() => handleStepClick(index)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ProgressIndicator isActive={index === currentStep} />
            <StepHeader>
              <StepNumber
                isCompleted={index < completedSteps}
                isActive={index === currentStep}
              >
                {index < completedSteps ? (
                  <CheckCircle size={16} />
                ) : (
                  index + 1
                )}
              </StepNumber>
              <StepIcon isActive={index === currentStep}>
                {getStepIcon(index)}
              </StepIcon>
              <StepTitle>
                Step {index + 1}
                {index === currentStep && ' (Current)'}
              </StepTitle>
            </StepHeader>
            <StepDescription>{step}</StepDescription>
          </StepItem>
        ))}
      </StepList>

      <QuickActions>
        <ActionButton
          primary
          onClick={onPlayPause}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Play size={20} />
          {isPlaying ? 'Pause Procedure' : 'Start Procedure'}
        </ActionButton>
        
        <ActionButton
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle size={20} />
          Restart Procedure
        </ActionButton>
      </QuickActions>

      <TipsSection>
        <TipsTitle>
          💡 Medical Tips
        </TipsTitle>
        <TipItem>Always examine the patient thoroughly before treatment</TipItem>
        <TipItem>Monitor vital signs throughout the procedure</TipItem>
        <TipItem>Follow proper sterilization protocols</TipItem>
        <TipItem>Document all findings and treatments</TipItem>
        <TipItem>Ensure patient comfort and safety at all times</TipItem>
      </TipsSection>
    </PanelContainer>
  );
}

export default InstructionPanel;
