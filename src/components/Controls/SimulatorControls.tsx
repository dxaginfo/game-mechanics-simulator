import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { 
  setSimulationStatus, 
  setSimulationSpeed, 
  resetSimulation,
  scorePoints,
  advanceTime,
  callTimeout,
  addFoul
} from '../../store/simulatorSlice';
import { 
  initializeResults, 
  addPossession, 
  completeSimulationRun, 
  saveResults 
} from '../../store/resultsSlice';

const SimulatorControls: React.FC = () => {
  const dispatch = useDispatch();
  const simulator = useSelector((state: RootState) => state.simulator);
  const scenarioId = useSelector((state: RootState) => state.scenarios.activeScenarioId);
  
  const [isPaused, setIsPaused] = useState(true);
  const simulationIntervalRef = useRef<number | null>(null);
  
  // Formatted game time (MM:SS)
  const formattedTime = `${Math.floor(simulator.gameState.timeRemaining / 60)}:${(simulator.gameState.timeRemaining % 60).toString().padStart(2, '0')}`;
  
  // Handle play/pause
  const toggleSimulation = () => {
    if (!scenarioId) {
      // Can't start simulation without a scenario
      return;
    }
    
    if (isPaused) {
      // Start simulation
      dispatch(setSimulationStatus(true));
      setIsPaused(false);
      
      // Initialize results if needed
      dispatch(initializeResults({
        shotClock: simulator.gameRules.shotClockDuration,
        threePointDistance: simulator.gameRules.threePointDistance,
        quarterLength: simulator.gameRules.quarterLength
      }));
    } else {
      // Pause simulation
      dispatch(setSimulationStatus(false));
      setIsPaused(true);
      
      // Clear interval
      if (simulationIntervalRef.current) {
        window.clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }
  };
  
  // Handle speed change
  const handleSpeedChange = (speed: number) => {
    dispatch(setSimulationSpeed(speed));
  };
  
  // Handle reset
  const handleReset = () => {
    // Stop simulation if running
    if (!isPaused) {
      toggleSimulation();
    }
    
    // Reset game state
    dispatch(resetSimulation());
  };
  
  // Handle save
  const handleSave = () => {
    dispatch(saveResults());
  };
  
  // Simulation logic
  useEffect(() => {
    if (!isPaused && !simulationIntervalRef.current) {
      // Calculate interval based on speed (higher speed = lower interval)
      const baseInterval = 1000; // 1 second
      const interval = baseInterval / simulator.simulationSpeed;
      
      simulationIntervalRef.current = window.setInterval(() => {
        // Check if game is over
        if (simulator.gameState.quarter >= 4 && simulator.gameState.timeRemaining <= 0) {
          if (simulator.gameState.homeScore !== simulator.gameState.awayScore) {
            // Game is over
            toggleSimulation();
            dispatch(completeSimulationRun());
            return;
          }
        }
        
        // Advance time
        const timeIncrement = 4; // Seconds to advance per tick
        dispatch(advanceTime(timeIncrement));
        
        // Simulate possession
        simulatePossession();
      }, interval);
    }
    
    return () => {
      if (simulationIntervalRef.current) {
        window.clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    };
  }, [isPaused, simulator.simulationSpeed]);
  
  // Simulate a single possession
  const simulatePossession = () => {
    const { homeTeam, awayTeam, gameState } = simulator;
    const offensiveTeam = gameState.homePossession ? homeTeam : awayTeam;
    const defensiveTeam = gameState.homePossession ? awayTeam : homeTeam;
    
    // Calculate possession duration (4-24 seconds)
    const minDuration = 4;
    const maxDuration = simulator.gameRules.shotClockDuration;
    const paceAdjustment = (10 - offensiveTeam.pacePreference) / 10; // Slower pace = longer possessions
    const duration = Math.min(
      Math.floor(minDuration + (maxDuration - minDuration) * paceAdjustment * Math.random()),
      gameState.timeRemaining
    );
    
    // Determine possession outcome
    const outcomes = [
      { type: 'shot', probability: 0.8 },
      { type: 'turnover', probability: 0.12 },
      { type: 'foul', probability: 0.08 }
    ];
    
    // Choose outcome based on probabilities
    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let outcomeType = '';
    
    for (const outcome of outcomes) {
      cumulativeProbability += outcome.probability;
      if (randomValue <= cumulativeProbability) {
        outcomeType = outcome.type;
        break;
      }
    }
    
    // Handle different outcomes
    if (outcomeType === 'shot') {
      // Determine shot location based on team's bias
      const shotLocationRandom = Math.random();
      let shotLocation: 'inside' | 'midRange' | 'threePoint';
      let shotValue: number;
      let shotPercentage: number;
      
      if (shotLocationRandom < offensiveTeam.shotSelectionBias.threePoint) {
        shotLocation = 'threePoint';
        shotValue = 3;
        shotPercentage = offensiveTeam.threePointPercentage;
      } else if (shotLocationRandom < offensiveTeam.shotSelectionBias.threePoint + offensiveTeam.shotSelectionBias.midRange) {
        shotLocation = 'midRange';
        shotValue = 2;
        shotPercentage = offensiveTeam.midRangePercentage;
      } else {
        shotLocation = 'inside';
        shotValue = 2;
        shotPercentage = offensiveTeam.insidePercentage;
      }
      
      // Adjust shot percentage based on defensive rating
      const defenseAdjustment = (defensiveTeam.defensiveRating - 100) / 100;
      shotPercentage = Math.max(0.1, shotPercentage - defenseAdjustment * 0.1);
      
      // Determine if shot is made
      const isMade = Math.random() < shotPercentage;
      
      // Create shot attempt
      const shotAttempt = {
        team: gameState.homePossession ? 'home' : 'away' as 'home' | 'away',
        location: shotLocation,
        made: isMade,
        points: isMade ? shotValue : 0,
        timeRemaining: gameState.timeRemaining - duration,
        quarter: gameState.quarter,
        gameTimeStamp: `Q${gameState.quarter} ${Math.floor((gameState.timeRemaining - duration) / 60)}:${((gameState.timeRemaining - duration) % 60).toString().padStart(2, '0')}`
      };
      
      // Add possession to results
      dispatch(addPossession({
        team: gameState.homePossession ? 'home' : 'away',
        duration,
        result: 'shot',
        shotAttempt,
        timeRemaining: gameState.timeRemaining - duration,
        quarter: gameState.quarter
      }));
      
      // Update score if shot is made
      if (isMade) {
        dispatch(scorePoints({
          team: gameState.homePossession ? 'home' : 'away',
          points: shotValue
        }));
      } else {
        // Change possession after missed shot
        dispatch(advanceTime(duration));
      }
    } else if (outcomeType === 'turnover') {
      // Handle turnover
      dispatch(addPossession({
        team: gameState.homePossession ? 'home' : 'away',
        duration,
        result: 'turnover',
        timeRemaining: gameState.timeRemaining - duration,
        quarter: gameState.quarter
      }));
      
      // Change possession
      dispatch(advanceTime(duration));
    } else if (outcomeType === 'foul') {
      // Handle foul
      const foulTeam = gameState.homePossession ? 'away' : 'home';
      dispatch(addFoul(foulTeam));
      
      // Check if in bonus
      const foulCount = foulTeam === 'home' ? gameState.homeTeamFouls : gameState.awayTeamFouls;
      
      if (foulCount >= simulator.gameRules.bonusThreshold) {
        // Free throws
        const shootingTeam = gameState.homePossession ? 'home' : 'away';
        const ftPercentage = gameState.homePossession ? homeTeam.freeThrowPercentage : awayTeam.freeThrowPercentage;
        
        // Two free throws
        for (let i = 0; i < 2; i++) {
          const isMade = Math.random() < ftPercentage;
          
          // Create shot attempt for free throw
          const shotAttempt = {
            team: shootingTeam,
            location: 'freeThrow' as 'freeThrow',
            made: isMade,
            points: isMade ? 1 : 0,
            timeRemaining: gameState.timeRemaining - duration,
            quarter: gameState.quarter,
            gameTimeStamp: `Q${gameState.quarter} ${Math.floor((gameState.timeRemaining - duration) / 60)}:${((gameState.timeRemaining - duration) % 60).toString().padStart(2, '0')}`
          };
          
          // Add possession for free throw
          dispatch(addPossession({
            team: shootingTeam,
            duration: 5, // Short duration for free throw
            result: 'shot',
            shotAttempt,
            timeRemaining: gameState.timeRemaining - duration,
            quarter: gameState.quarter
          }));
          
          // Update score if made
          if (isMade) {
            dispatch(scorePoints({
              team: shootingTeam,
              points: 1
            }));
          }
        }
      }
      
      // Add possession to results
      dispatch(addPossession({
        team: gameState.homePossession ? 'home' : 'away',
        duration,
        result: 'foul',
        timeRemaining: gameState.timeRemaining - duration,
        quarter: gameState.quarter
      }));
      
      // Advance time
      dispatch(advanceTime(duration));
    }
  };
  
  // Manual possession simulation for step button
  const simulateStep = () => {
    if (!scenarioId) return;
    
    // Initialize results if needed
    if (!simulator.isSimulating) {
      dispatch(setSimulationStatus(true));
      dispatch(initializeResults({
        shotClock: simulator.gameRules.shotClockDuration,
        threePointDistance: simulator.gameRules.threePointDistance,
        quarterLength: simulator.gameRules.quarterLength
      }));
    }
    
    simulatePossession();
  };
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Simulator Controls</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-800 text-white p-4 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-sm text-gray-400">Quarter</div>
            <div className="text-2xl font-bold">Q{simulator.gameState.quarter}</div>
          </div>
          <div className="text-3xl font-bold tabular-nums">
            {formattedTime}
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
          <div>
            <div className="text-sm text-blue-600 font-medium">{simulator.homeTeam.name}</div>
            <div className="text-3xl font-bold">{simulator.gameState.homeScore}</div>
          </div>
          <div className="text-gray-400 mx-2">vs</div>
          <div className="text-right">
            <div className="text-sm text-red-600 font-medium">{simulator.awayTeam.name}</div>
            <div className="text-3xl font-bold">{simulator.gameState.awayScore}</div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Speed:</span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((speed) => (
              <button
                key={speed}
                className={`w-8 h-8 rounded flex items-center justify-center ${
                  simulator.simulationSpeed === speed
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => handleSpeedChange(speed)}
                disabled={!isPaused && simulator.isSimulating}
              >
                {speed}
              </button>
            ))}
          </div>
        </div>
        
        <div className="text-sm">
          <span className={`px-2 py-1 rounded ${
            simulator.gameState.homePossession ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
          }`}>
            {simulator.gameState.homePossession ? simulator.homeTeam.name : simulator.awayTeam.name} Ball
          </span>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button
          className={`flex-1 btn ${isPaused ? 'btn-primary' : 'btn-danger'}`}
          onClick={toggleSimulation}
          disabled={!scenarioId}
        >
          {isPaused ? (
            <>
              <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Play
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Pause
            </>
          )}
        </button>
        
        <button
          className="btn btn-secondary flex-1"
          onClick={simulateStep}
          disabled={!scenarioId || !isPaused}
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
          Step
        </button>
        
        <button
          className="btn btn-secondary flex-1"
          onClick={handleReset}
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          Reset
        </button>
        
        <button
          className="btn btn-primary flex-1"
          onClick={handleSave}
          disabled={!simulator.isSimulating && isPaused}
        >
          <svg className="w-5 h-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
          </svg>
          Save Results
        </button>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Fouls:</span>
            <span className="font-medium">{simulator.gameState.homeTeamFouls}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Timeouts:</span>
            <span className="font-medium">{simulator.gameState.timeouts.home}</span>
          </div>
        </div>
        
        <div className="p-3 bg-red-50 rounded-lg">
          <div className="flex justify-between text-sm mb-1">
            <span>Fouls:</span>
            <span className="font-medium">{simulator.gameState.awayTeamFouls}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Timeouts:</span>
            <span className="font-medium">{simulator.gameState.timeouts.away}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorControls;