import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const ResultsPanel: React.FC = () => {
  const currentResults = useSelector((state: RootState) => state.results.currentResults);
  const homeTeam = useSelector((state: RootState) => state.simulator.homeTeam);
  const awayTeam = useSelector((state: RootState) => state.simulator.awayTeam);
  const isSimulating = useSelector((state: RootState) => state.simulator.isSimulating);
  
  const [activeTab, setActiveTab] = useState<'stats' | 'possessions' | 'boxScore'>('stats');
  
  // Helper to format percentages
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };
  
  // No results to display
  if (!currentResults) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4">Results</h2>
        <div className="py-8 text-center text-gray-500">
          <p className="mb-2">No simulation data yet</p>
          <p className="text-sm">Select a scenario and start the simulation to see results</p>
        </div>
      </div>
    );
  }
  
  // Prepare data for rendering
  const { gameStats, possessions } = currentResults;
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Results</h2>
        <div className="text-sm text-gray-500">
          {isSimulating ? (
            <span className="text-green-600 font-medium">Simulation active</span>
          ) : (
            <span>Simulation {currentResults.possessions.length > 0 ? 'paused' : 'ready'}</span>
          )}
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('stats')}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'stats'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Team Stats
          </button>
          <button
            onClick={() => setActiveTab('possessions')}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'possessions'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Possessions
          </button>
          <button
            onClick={() => setActiveTab('boxScore')}
            className={`py-2 px-4 text-sm font-medium border-b-2 ${
              activeTab === 'boxScore'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Box Score
          </button>
        </nav>
      </div>
      
      {/* Content based on active tab */}
      <div className="mt-4">
        {activeTab === 'stats' && (
          <div className="space-y-4">
            {/* Points */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Points</h3>
              <div className="flex items-center">
                {/* Home team */}
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-blue-600">{homeTeam.name}</span>
                    <span className="font-semibold">{gameStats.home.points}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${
                          gameStats.home.points + gameStats.away.points > 0
                            ? (gameStats.home.points / (gameStats.home.points + gameStats.away.points)) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
                
                {/* Spacer */}
                <div className="w-8" />
                
                {/* Away team */}
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-red-600">{awayTeam.name}</span>
                    <span className="font-semibold">{gameStats.away.points}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{
                        width: `${
                          gameStats.home.points + gameStats.away.points > 0
                            ? (gameStats.away.points / (gameStats.home.points + gameStats.away.points)) * 100
                            : 0
                        }%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Shooting Stats */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Shooting</h3>
              
              <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                <div></div>
                <div className="text-center text-blue-600 font-medium">{homeTeam.name}</div>
                <div className="text-center text-red-600 font-medium">{awayTeam.name}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>FG%</div>
                <div className="text-center">
                  {gameStats.home.fieldGoalsAttempted > 0
                    ? formatPercent(gameStats.home.fieldGoalsMade / gameStats.home.fieldGoalsAttempted)
                    : '0.0%'}
                </div>
                <div className="text-center">
                  {gameStats.away.fieldGoalsAttempted > 0
                    ? formatPercent(gameStats.away.fieldGoalsMade / gameStats.away.fieldGoalsAttempted)
                    : '0.0%'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>3PT%</div>
                <div className="text-center">
                  {gameStats.home.threePointersAttempted > 0
                    ? formatPercent(gameStats.home.threePointersMade / gameStats.home.threePointersAttempted)
                    : '0.0%'}
                </div>
                <div className="text-center">
                  {gameStats.away.threePointersAttempted > 0
                    ? formatPercent(gameStats.away.threePointersMade / gameStats.away.threePointersAttempted)
                    : '0.0%'}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>FT%</div>
                <div className="text-center">
                  {gameStats.home.freeThrowsAttempted > 0
                    ? formatPercent(gameStats.home.freeThrowsMade / gameStats.home.freeThrowsAttempted)
                    : '0.0%'}
                </div>
                <div className="text-center">
                  {gameStats.away.freeThrowsAttempted > 0
                    ? formatPercent(gameStats.away.freeThrowsMade / gameStats.away.freeThrowsAttempted)
                    : '0.0%'}
                </div>
              </div>
            </div>
            
            {/* Advanced Stats */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Advanced Stats</h3>
              
              <div className="grid grid-cols-3 gap-2 text-sm mb-2">
                <div></div>
                <div className="text-center text-blue-600 font-medium">{homeTeam.name}</div>
                <div className="text-center text-red-600 font-medium">{awayTeam.name}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>Pace</div>
                <div className="text-center">{gameStats.home.pace.toFixed(1)}</div>
                <div className="text-center">{gameStats.away.pace.toFixed(1)}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>Off. Rating</div>
                <div className="text-center">{gameStats.home.offensiveRating.toFixed(1)}</div>
                <div className="text-center">{gameStats.away.offensiveRating.toFixed(1)}</div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>eFG%</div>
                <div className="text-center">
                  {formatPercent(gameStats.home.effectiveFieldGoalPercentage)}
                </div>
                <div className="text-center">
                  {formatPercent(gameStats.away.effectiveFieldGoalPercentage)}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>TS%</div>
                <div className="text-center">
                  {formatPercent(gameStats.home.trueShootingPercentage)}
                </div>
                <div className="text-center">
                  {formatPercent(gameStats.away.trueShootingPercentage)}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'possessions' && (
          <div className="max-h-[300px] overflow-y-auto">
            {possessions.length > 0 ? (
              <div className="space-y-1">
                {possessions.slice().reverse().map((possession, index) => {
                  const isHomeTeam = possession.team === 'home';
                  const teamName = isHomeTeam ? homeTeam.name : awayTeam.name;
                  const timeStamp = `Q${possession.quarter} ${Math.floor(possession.timeRemaining / 60)}:${(possession.timeRemaining % 60).toString().padStart(2, '0')}`;
                  
                  let resultText = '';
                  let resultClass = '';
                  
                  if (possession.result === 'shot' && possession.shotAttempt) {
                    if (possession.shotAttempt.made) {
                      resultText = `${teamName} scored ${possession.shotAttempt.points} points (${possession.shotAttempt.location})`;
                      resultClass = 'text-green-600';
                    } else {
                      resultText = `${teamName} missed ${possession.shotAttempt.location} shot`;
                      resultClass = 'text-red-600';
                    }
                  } else if (possession.result === 'turnover') {
                    resultText = `${teamName} turnover`;
                    resultClass = 'text-orange-600';
                  } else if (possession.result === 'foul') {
                    resultText = `Foul on ${isHomeTeam ? awayTeam.name : homeTeam.name}`;
                    resultClass = 'text-purple-600';
                  }
                  
                  return (
                    <div key={index} className="p-2 border-b border-gray-100 flex justify-between text-sm">
                      <span className={`${isHomeTeam ? 'text-blue-600' : 'text-red-600'} font-medium`}>
                        {timeStamp}
                      </span>
                      <span className={resultClass}>{resultText}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <p>No possessions recorded yet</p>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'boxScore' && (
          <div>
            {/* Home Team Box */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-blue-600 mb-2">{homeTeam.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-right">PTS</th>
                      <th className="px-3 py-2 text-right">FGM-A</th>
                      <th className="px-3 py-2 text-right">3PM-A</th>
                      <th className="px-3 py-2 text-right">FTM-A</th>
                      <th className="px-3 py-2 text-right">TO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-3 py-2 font-medium">{homeTeam.name}</td>
                      <td className="px-3 py-2 text-right">{gameStats.home.points}</td>
                      <td className="px-3 py-2 text-right">
                        {gameStats.home.fieldGoalsMade}-{gameStats.home.fieldGoalsAttempted}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {gameStats.home.threePointersMade}-{gameStats.home.threePointersAttempted}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {gameStats.home.freeThrowsMade}-{gameStats.home.freeThrowsAttempted}
                      </td>
                      <td className="px-3 py-2 text-right">{gameStats.home.turnovers}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Away Team Box */}
            <div>
              <h3 className="text-sm font-semibold text-red-600 mb-2">{awayTeam.name}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="px-3 py-2 text-left">Team</th>
                      <th className="px-3 py-2 text-right">PTS</th>
                      <th className="px-3 py-2 text-right">FGM-A</th>
                      <th className="px-3 py-2 text-right">3PM-A</th>
                      <th className="px-3 py-2 text-right">FTM-A</th>
                      <th className="px-3 py-2 text-right">TO</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-3 py-2 font-medium">{awayTeam.name}</td>
                      <td className="px-3 py-2 text-right">{gameStats.away.points}</td>
                      <td className="px-3 py-2 text-right">
                        {gameStats.away.fieldGoalsMade}-{gameStats.away.fieldGoalsAttempted}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {gameStats.away.threePointersMade}-{gameStats.away.threePointersAttempted}
                      </td>
                      <td className="px-3 py-2 text-right">
                        {gameStats.away.freeThrowsMade}-{gameStats.away.freeThrowsAttempted}
                      </td>
                      <td className="px-3 py-2 text-right">{gameStats.away.turnovers}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;