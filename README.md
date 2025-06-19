# Game Mechanics Simulator

An interactive basketball game mechanics simulator for exploring strategic gameplay scenarios and rule implications.

![Game Mechanics Simulator Screenshot](assets/simulator-preview.png)

## 🏀 Overview

The Game Mechanics Simulator is a web-based tool that allows coaches, players, and basketball enthusiasts to test different game scenarios by manipulating rules, strategies, and player attributes. This simulator helps users understand how various rule changes and strategic decisions might impact actual game outcomes.

## ✨ Key Features

- **Rule Manipulation**: Experiment with NBA rule changes (shot clock, 3-point line distance, etc.) to see how they affect gameplay
- **Scenario Builder**: Create custom game situations (end-of-game, specific defensive sets, etc.)
- **Strategy Tester**: Simulate offensive and defensive strategies against different opponents
- **Interactive Visualization**: Dynamic charts and visual representations of simulation results
- **Data-Driven Insights**: Statistics and metrics from each simulation run

## 🔧 Technology Stack

- **Frontend**: React.js with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Data Visualization**: D3.js
- **Build & Deploy**: Vite, GitHub Pages

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/dxaginfo/game-mechanics-simulator.git

# Navigate to the project directory
cd game-mechanics-simulator

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 📋 Project Structure

```
game-mechanics-simulator/
├── src/
│   ├── components/        # UI components
│   │   ├── Court/         # Basketball court visualization
│   │   ├── Controls/      # User input controls
│   │   ├── Results/       # Simulation results display
│   │   └── Scenarios/     # Predefined and custom scenarios
│   ├── hooks/             # Custom React hooks
│   ├── models/            # TypeScript interfaces/types
│   ├── services/          # Simulation logic & calculations
│   ├── store/             # Redux state management
│   ├── utils/             # Utility functions
│   └── App.tsx            # Main application component
├── public/                # Static assets
└── README.md              # Project documentation
```

## 🎯 Core Simulator Components

### Rule Engine

The Rule Engine is the core of the simulator that handles the mathematical models and logic for:

- Possession outcomes based on offensive and defensive ratings
- Shot selection probability distributions
- Game flow management (timeouts, fouls, etc.)
- Clock and score management

### Scenario Templates

The simulator includes several pre-built scenarios that users can modify:

1. **Late Game Situations**: Test different strategies with 24 seconds left and down by 2
2. **Pace Impact Analysis**: See how changing the shot clock affects scoring and efficiency
3. **Three-Point Revolution**: Adjust three-point line distance to see impact on shot selection
4. **Foul Strategy Optimizer**: Determine optimal fouling strategies in end-game situations

### Simulation Controls

Users can manipulate various parameters:

- **Game Rules**: Shot clock duration, three-point distance, bonus rules
- **Team Strategies**: Shot selection preferences, defensive intensity, pace
- **Player Attributes**: Shooting percentages, defensive ratings, fatigue factors
- **Game Context**: Score, time remaining, timeouts, fouls

## 🔍 Use Cases

1. **Coaches**: Test late-game strategies without real-game consequences
2. **Analysts**: Examine rule change impacts through data-driven simulations
3. **Basketball Operations**: Evaluate potential league rule changes with quantifiable metrics
4. **Basketball Enthusiasts**: Explore "what-if" scenarios for favorite teams and games

## 📈 Future Enhancements

- Machine learning integration for more accurate predictions
- Additional visualization types for better result interpretation
- Multi-game simulation for detecting statistical patterns
- API for importing real player and team statistics
- Mobile optimization for on-the-go scenario testing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Built with 🏀 by [DXAGInfo](https://github.com/dxaginfo)