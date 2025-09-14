import React from 'react';
import styled, { keyframes } from 'styled-components';

// Animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(0, 255, 255, 0.3); }
  50% { box-shadow: 0 0 40px rgba(0, 255, 255, 0.6); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Styled Components
const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: 
    linear-gradient(135deg, rgba(0, 0, 0, 0.2) 0%, rgba(26, 26, 46, 0.3) 50%, rgba(22, 33, 62, 0.4) 100%),
    url('/images/vr-industrial-bg.jpg'),
    linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  background-size: contain, contain, cover;
  background-position: center center, center center, center center;
  background-repeat: no-repeat, no-repeat, no-repeat;
  background-attachment: fixed, fixed, fixed;
  color: white;
  font-family: 'Arial', sans-serif;
  overflow: hidden;
  position: relative;

  @media (max-width: 768px) {
    background-attachment: scroll, scroll, scroll;
    background-size: contain, contain, cover;
    background-position: center center, center center, center center;
  }

  @media (max-width: 480px) {
    background-size: contain, contain, cover;
    background-position: center center, center center, center center;
  }
`;

const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 80% 20%, rgba(0, 128, 255, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 40% 40%, rgba(255, 0, 255, 0.08) 0%, transparent 60%);
  animation: ${float} 6s ease-in-out infinite;
  z-index: 1;
`;

const MainContent = styled.div`
  text-align: center;
  z-index: 3;
  max-width: 1000px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  border-radius: 25px;
  margin: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const HeroSection = styled.div`
  margin-bottom: 1.5rem;
`;

const Logo = styled.div`
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 0.8rem;
  background: linear-gradient(45deg, #00ffff, #0080ff, #8000ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 2.8rem;
  margin: 0 0 0.8rem 0;
  background: linear-gradient(45deg, #00ffff, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
  line-height: 1.1;
`;

const Subtitle = styled.h2`
  font-size: 1.3rem;
  margin: 0 0 1rem 0;
  color: #cccccc;
  font-weight: 300;
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
  color: #aaaaaa;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const FeatureList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 1rem 0;
  max-width: 900px;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 1.2rem;
  border-radius: 15px;
  border: 1px solid rgba(0, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;

  &:hover {
    transform: translateY(-5px);
    border-color: rgba(0, 255, 255, 0.5);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.8rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  margin: 0 0 0.5rem 0;
  color: #00ffff;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 0.9rem;
  margin: 0;
  color: #cccccc;
  line-height: 1.3;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 1.5rem 0 1rem 0;
`;

const VRButton = styled.button`
  background: linear-gradient(135deg, #00ffff 0%, #0080ff 100%);
  border: none;
  color: #000;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
  animation: ${glow} 2s ease-in-out infinite;
  min-width: 200px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.6);
    animation: none;
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled.button`
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  padding: 0.8rem 2rem;
  font-size: 1.1rem;
  font-weight: bold;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  min-width: 200px;

  &:hover {
    background: rgba(0, 255, 255, 0.1);
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 255, 255, 0.3);
  }
`;

const StatusBar = styled.div`
  position: fixed;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(0, 255, 255, 0.3);
  color: #00ffff;
  font-size: 0.8rem;
  backdrop-filter: blur(10px);
`;

function HomePage({ onEnterVR }) {
  return (
    <HomeContainer>
      <BackgroundPattern />
      
      <MainContent>
        <HeroSection>
          <Logo>⚡</Logo>
          <Title>VR Circuit Learning</Title>
          <Subtitle>Immersive Electronics Education</Subtitle>
          
          <Description>
            Experience the future of electronics education with our cutting-edge VR circuit learning module. 
            Build, simulate, and learn circuits in an immersive 3D environment that brings electronics to life.
          </Description>
        </HeroSection>

        <FeatureList>
          <FeatureItem>
            <FeatureIcon>🥽</FeatureIcon>
            <FeatureTitle>VR Immersion</FeatureTitle>
            <FeatureDescription>
              Step into a virtual reality environment where you can interact with electronic components in 3D space.
            </FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureIcon>🔧</FeatureIcon>
            <FeatureTitle>Interactive Building</FeatureTitle>
            <FeatureDescription>
              Drag and drop components, make connections, and build circuits with intuitive mouse controls.
            </FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureIcon>📚</FeatureIcon>
            <FeatureTitle>Guided Tutorials</FeatureTitle>
            <FeatureDescription>
              Learn step-by-step with interactive tutorials that guide you through circuit assembly.
            </FeatureDescription>
          </FeatureItem>

          <FeatureItem>
            <FeatureIcon>⚡</FeatureIcon>
            <FeatureTitle>Real-time Simulation</FeatureTitle>
            <FeatureDescription>
              Watch your circuits come to life with live electrical simulation and visual feedback.
            </FeatureDescription>
          </FeatureItem>
        </FeatureList>

        <ButtonContainer>
          <VRButton onClick={onEnterVR}>
            🥽 Enter VR Simulation
          </VRButton>
          <SecondaryButton onClick={() => window.open('https://github.com', '_blank')}>
            📖 Learn More
          </SecondaryButton>
        </ButtonContainer>
      </MainContent>

      <StatusBar>
        Ready to explore electronics in VR • Click "Enter VR Simulation" to begin
      </StatusBar>
    </HomeContainer>
  );
}

export default HomePage;
