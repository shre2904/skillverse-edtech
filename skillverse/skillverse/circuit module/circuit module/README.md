# VR Circuit Learning Module

An immersive VR circuit building and learning platform built with React and Three.js. This module provides hands-on experience for learning electronics through interactive circuit construction, real-time simulation, and guided tutorials in a virtual reality environment.

## Features

### 🔧 Interactive Circuit Building
- **Drag & Drop Interface**: Intuitive component placement and connection
- **Real-time Simulation**: Live circuit behavior with voltage and current visualization
- **Component Library**: Resistors, capacitors, inductors, batteries, LEDs, diodes, transistors, and wires
- **Visual Feedback**: Animated connections, voltage indicators, and current flow visualization

### 📚 Educational Features
- **Guided Tutorials**: Step-by-step lessons for different skill levels
- **Interactive Learning**: Hands-on experience with immediate feedback
- **Progress Tracking**: Track completion of lessons and challenges
- **Real-world Physics**: Accurate electrical calculations and behavior

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Grid System**: Snap-to-grid for precise component alignment
- **Zoom & Pan**: Navigate large circuits with ease

### 🔬 Advanced Features
- **Circuit Simulation Engine**: Real-time electrical analysis using nodal analysis
- **AR/IR Ready**: Built with Three.js for future AR/IR integration
- **Modular Architecture**: Easy to extend with new components and features
- **Performance Optimized**: Smooth 60fps simulation even with complex circuits

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   cd circuit-learning-module
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the VR simulation**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000` - VR simulation starts immediately!

## Usage

### Building Circuits

1. **Add Components**: Drag components from the left palette to the workspace
2. **Connect Components**: Click on connection points to create wires
3. **Simulate**: Click the "Start Simulation" button to see your circuit in action
4. **Learn**: Follow the interactive tutorials to master different concepts

### Component Types

- **Resistors**: Limit current flow (1Ω - 1MΩ)
- **Capacitors**: Store electrical energy (1pF - 1F)
- **Inductors**: Store magnetic energy (1μH - 1H)
- **Batteries**: Power sources (1.5V - 12V)
- **LEDs**: Light-emitting diodes with forward voltage
- **Diodes**: One-way current flow
- **Transistors**: Amplification and switching
- **Wires**: Low-resistance connections

### Tutorial Lessons

1. **Welcome**: Introduction to the interface
2. **Basic Components**: Understanding fundamental parts
3. **Simple LED Circuit**: Your first working circuit
4. **Series and Parallel**: Different connection methods
5. **Advanced Components**: Complex devices and applications

## Technical Architecture

### Core Technologies
- **React 18**: Modern UI framework
- **Framer Motion**: Smooth animations and transitions
- **React DnD**: Drag and drop functionality
- **Styled Components**: CSS-in-JS styling
- **Three.js**: 3D graphics for future AR features

### Key Components

```
src/
├── components/
│   ├── CircuitWorkspace.js    # Main workspace area
│   ├── ComponentPalette.js    # Component selection panel
│   ├── CircuitComponent.js    # Individual component rendering
│   ├── Connection.js          # Wire connections
│   ├── Toolbar.js            # Control panel
│   ├── TutorialPanel.js      # Learning interface
│   └── Grid.js               # Background grid
├── context/
│   └── CircuitContext.js     # State management
├── utils/
│   └── CircuitSimulator.js   # Physics simulation engine
└── App.js                    # Main application
```

### Simulation Engine

The circuit simulator uses **Modified Nodal Analysis (MNA)** to solve complex circuits:

- **Node Analysis**: Calculates voltages at circuit nodes
- **Branch Analysis**: Determines current through each component
- **Real-time Updates**: Continuous simulation with 60fps performance
- **Accurate Physics**: Proper electrical behavior modeling

## Customization

### Adding New Components

1. **Define Component**: Add to `componentConfig` in `CircuitComponent.js`
2. **Add Icon**: Create or import an icon component
3. **Simulation Logic**: Implement in `CircuitSimulator.js`
4. **Palette Entry**: Add to `ComponentPalette.js`

### Styling

The app uses Styled Components for theming. Key theme variables:

```javascript
const theme = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#4CAF50',
  warning: '#FF8C00',
  error: '#f44336',
  background: '#f8f9fa'
};
```

## Future Enhancements

### Planned Features
- **AR Integration**: Use device camera for real-world circuit overlay
- **IR Support**: Infrared component detection and recognition
- **3D Visualization**: Three-dimensional circuit representation
- **Multiplayer**: Collaborative circuit building
- **Export Options**: Save circuits as images or simulation files
- **Advanced Components**: Microcontrollers, sensors, and ICs
- **Circuit Analysis**: Frequency response, transient analysis
- **Mobile App**: React Native version for mobile devices

### AR/IR Integration

The module is designed with AR/IR capabilities in mind:

- **Three.js Foundation**: Ready for 3D scene integration
- **Camera Access**: Prepared for device camera integration
- **Object Recognition**: Structure for component detection
- **Spatial Tracking**: Foundation for real-world positioning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for educational and commercial purposes.

## Support

For questions, issues, or feature requests, please open an issue on the project repository.

---

**Happy Circuit Building! 🔌⚡**
