import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { setActiveScenario } from '../../store/scenariosSlice';
import { updateHomeTeam, updateAwayTeam, updateGameRules, updateGameState, resetSimulation } from '../../store/simulatorSlice';

const ScenarioSelector: React.FC = () => {
  const dispatch = useDispatch();
  const scenarios = useSelector((state: RootState) => state.scenarios.scenarios);
  const activeScenarioId = useSelector((state: RootState) => state.scenarios.activeScenarioId);
  const isSimulating = useSelector((state: RootState) => state.simulator.isSimulating);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleScenarioSelect = (scenarioId: string) => {
    if (isSimulating) {
      // Don't allow changing scenarios while simulating
      return;
    }
    
    const scenario = scenarios.find(s => s.id === scenarioId);
    
    if (scenario) {
      // Apply scenario settings to simulator state
      dispatch(updateHomeTeam(scenario.homeTeam));
      dispatch(updateAwayTeam(scenario.awayTeam));
      dispatch(updateGameRules(scenario.gameRules));
      dispatch(updateGameState(scenario.gameState));
      dispatch(setActiveScenario(scenarioId));
    }
  };
  
  const activeScenario = scenarios.find(s => s.id === activeScenarioId);
  
  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Game Scenario</h2>
      
      {activeScenario ? (
        <div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-blue-700">{activeScenario.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{activeScenario.description}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              disabled={isSimulating}
              className="btn btn-secondary text-sm py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-blue-600">{activeScenario.homeTeam.name}</h4>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Off. Rating:</span>
                  <span className="font-medium">{activeScenario.homeTeam.offensiveRating}</span>
                </div>
                <div className="flex justify-between">
                  <span>Def. Rating:</span>
                  <span className="font-medium">{activeScenario.homeTeam.defensiveRating}</span>
                </div>
                <div className="flex justify-between">
                  <span>3PT%:</span>
                  <span className="font-medium">{(activeScenario.homeTeam.threePointPercentage * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pace:</span>
                  <span className="font-medium">{activeScenario.homeTeam.pacePreference}/10</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-red-600">{activeScenario.awayTeam.name}</h4>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Off. Rating:</span>
                  <span className="font-medium">{activeScenario.awayTeam.offensiveRating}</span>
                </div>
                <div className="flex justify-between">
                  <span>Def. Rating:</span>
                  <span className="font-medium">{activeScenario.awayTeam.defensiveRating}</span>
                </div>
                <div className="flex justify-between">
                  <span>3PT%:</span>
                  <span className="font-medium">{(activeScenario.awayTeam.threePointPercentage * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Pace:</span>
                  <span className="font-medium">{activeScenario.awayTeam.pacePreference}/10</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold">Game Rules</h4>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Shot Clock:</span>
                  <span className="font-medium">{activeScenario.gameRules.shotClockDuration} seconds</span>
                </div>
                <div className="flex justify-between">
                  <span>3PT Distance:</span>
                  <span className="font-medium">{activeScenario.gameRules.threePointDistance} feet</span>
                </div>
                <div className="flex justify-between">
                  <span>Quarter Length:</span>
                  <span className="font-medium">{activeScenario.gameRules.quarterLength} minutes</span>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold">Starting Game State</h4>
              <div className="mt-2 text-sm">
                <div className="flex justify-between">
                  <span>Score:</span>
                  <span className="font-medium">
                    {activeScenario.gameState.homeScore} - {activeScenario.gameState.awayScore}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Quarter:</span>
                  <span className="font-medium">{activeScenario.gameState.quarter}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span className="font-medium">
                    {Math.floor(activeScenario.gameState.timeRemaining / 60)}:
                    {(activeScenario.gameState.timeRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Possession:</span>
                  <span className="font-medium">
                    {activeScenario.gameState.homePossession ? activeScenario.homeTeam.name : activeScenario.awayTeam.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => dispatch(resetSimulation())}
              disabled={isSimulating}
              className="btn btn-secondary text-sm py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Game State
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-gray-500 mb-4">No scenario selected</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            Select Scenario
          </button>
        </div>
      )}
      
      {/* Scenario Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Select Game Scenario</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto p-4 max-h-[calc(80vh-8rem)]">
              <div className="space-y-4">
                {scenarios.map((scenario) => (
                  <div
                    key={scenario.id}
                    className={`p-4 border rounded-lg cursor-pointer transition hover:shadow-md ${
                      scenario.id === activeScenarioId ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                    }`}
                    onClick={() => handleScenarioSelect(scenario.id)}
                  >
                    <h4 className="font-semibold text-lg">{scenario.name}</h4>
                    <p className="text-gray-600 mt-1">{scenario.description}</p>
                    
                    <div className="mt-3 flex justify-between text-sm">
                      <div>
                        <span className="text-blue-600 font-medium">{scenario.homeTeam.name}</span>
                        {' vs '}
                        <span className="text-red-600 font-medium">{scenario.awayTeam.name}</span>
                      </div>
                      <div>
                        <span className="font-medium">
                          {scenario.gameState.homeScore} - {scenario.gameState.awayScore}
                        </span>
                        {' | '}
                        <span>
                          Q{scenario.gameState.quarter} {Math.floor(scenario.gameState.timeRemaining / 60)}:
                          {(scenario.gameState.timeRemaining % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-secondary mr-2"
              >
                Cancel
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-primary"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScenarioSelector;