import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Shot location types
export type ShotLocation = 'inside' | 'midRange' | 'threePoint' | 'freeThrow';

// Shot attempt result
export interface ShotAttempt {
  team: 'home' | 'away';
  location: ShotLocation;
  made: boolean;
  points: number;
  timeRemaining: number; // seconds
  quarter: number;
  gameTimeStamp: string; // formatted time like "Q4 2:35"
  player?: string; // If we add players in the future
}

// Possession result
export interface Possession {
  team: 'home' | 'away';
  duration: number; // seconds
  result: 'shot' | 'turnover' | 'foul' | 'shotClockViolation' | 'outOfBounds';
  shotAttempt?: ShotAttempt;
  timeRemaining: number; // seconds
  quarter: number;
}

// Game statistics
export interface TeamStats {
  points: number;
  possessions: number;
  fieldGoalsAttempted: number;
  fieldGoalsMade: number;
  threePointersAttempted: number;
  threePointersMade: number;
  freeThrowsAttempted: number;
  freeThrowsMade: number;
  turnovers: number;
  fouls: number;
  offensiveRating: number; // Points per 100 possessions
  effectiveFieldGoalPercentage: number;
  trueShootingPercentage: number;
  pace: number; // Possessions per 48 minutes
}

export interface GameStats {
  home: TeamStats;
  away: TeamStats;
}

// Simulation results
export interface SimulationResults {
  possessions: Possession[];
  gameStats: GameStats;
  shotChart: ShotAttempt[];
  runsCompleted: number;
  simulationDateTime: string;
  parameters: {
    shotClock: number;
    threePointDistance: number;
    quarterLength: number;
  };
}

// Slice state
interface ResultsState {
  currentResults: SimulationResults | null;
  savedResults: SimulationResults[];
  comparisonResults: SimulationResults | null;
  isComparing: boolean;
}

// Initial empty stats object
const emptyTeamStats: TeamStats = {
  points: 0,
  possessions: 0,
  fieldGoalsAttempted: 0,
  fieldGoalsMade: 0,
  threePointersAttempted: 0,
  threePointersMade: 0,
  freeThrowsAttempted: 0,
  freeThrowsMade: 0,
  turnovers: 0,
  fouls: 0,
  offensiveRating: 0,
  effectiveFieldGoalPercentage: 0,
  trueShootingPercentage: 0,
  pace: 0
};

// Initial empty simulation results
const emptySimulationResults: SimulationResults = {
  possessions: [],
  gameStats: {
    home: { ...emptyTeamStats },
    away: { ...emptyTeamStats }
  },
  shotChart: [],
  runsCompleted: 0,
  simulationDateTime: new Date().toISOString(),
  parameters: {
    shotClock: 24,
    threePointDistance: 23.75,
    quarterLength: 12
  }
};

const initialState: ResultsState = {
  currentResults: null,
  savedResults: [],
  comparisonResults: null,
  isComparing: false
};

const resultsSlice = createSlice({
  name: 'results',
  initialState,
  reducers: {
    initializeResults: (state, action: PayloadAction<{ shotClock: number, threePointDistance: number, quarterLength: number }>) => {
      state.currentResults = {
        ...emptySimulationResults,
        simulationDateTime: new Date().toISOString(),
        parameters: action.payload
      };
    },
    addPossession: (state, action: PayloadAction<Possession>) => {
      if (state.currentResults) {
        state.currentResults.possessions.push(action.payload);
        
        // Update team stats
        const team = action.payload.team;
        const teamStats = team === 'home' ? state.currentResults.gameStats.home : state.currentResults.gameStats.away;
        
        teamStats.possessions += 1;
        
        if (action.payload.result === 'turnover') {
          teamStats.turnovers += 1;
        } else if (action.payload.result === 'foul') {
          teamStats.fouls += 1;
        }
        
        // If there was a shot attempt, update shot stats
        if (action.payload.shotAttempt) {
          const shot = action.payload.shotAttempt;
          
          // Add to shot chart
          state.currentResults.shotChart.push(shot);
          
          // Update points
          teamStats.points += shot.points;
          
          // Update shooting stats based on shot location
          if (shot.location === 'threePoint') {
            teamStats.threePointersAttempted += 1;
            if (shot.made) teamStats.threePointersMade += 1;
            teamStats.fieldGoalsAttempted += 1;
            if (shot.made) teamStats.fieldGoalsMade += 1;
          } else if (shot.location === 'freeThrow') {
            teamStats.freeThrowsAttempted += 1;
            if (shot.made) teamStats.freeThrowsMade += 1;
          } else {
            teamStats.fieldGoalsAttempted += 1;
            if (shot.made) teamStats.fieldGoalsMade += 1;
          }
        }
        
        // Calculate advanced stats
        if (teamStats.possessions > 0) {
          teamStats.offensiveRating = (teamStats.points / teamStats.possessions) * 100;
        }
        
        if (teamStats.fieldGoalsAttempted > 0) {
          teamStats.effectiveFieldGoalPercentage = (teamStats.fieldGoalsMade + 0.5 * teamStats.threePointersMade) / teamStats.fieldGoalsAttempted;
        }
        
        if (teamStats.fieldGoalsAttempted + teamStats.freeThrowsAttempted > 0) {
          teamStats.trueShootingPercentage = teamStats.points / (2 * (teamStats.fieldGoalsAttempted + 0.44 * teamStats.freeThrowsAttempted));
        }
        
        // Calculate pace (possessions per 48 minutes)
        const totalPossessions = state.currentResults.gameStats.home.possessions + state.currentResults.gameStats.away.possessions;
        const minutesPlayed = state.currentResults.parameters.quarterLength * (state.currentResults.possessions[0].quarter - 1) + 
                             (state.currentResults.parameters.quarterLength * 60 - action.payload.timeRemaining) / 60;
                             
        if (minutesPlayed > 0) {
          const pace = totalPossessions * (48 / minutesPlayed);
          state.currentResults.gameStats.home.pace = pace;
          state.currentResults.gameStats.away.pace = pace;
        }
      }
    },
    completeSimulationRun: (state) => {
      if (state.currentResults) {
        state.currentResults.runsCompleted += 1;
      }
    },
    saveResults: (state) => {
      if (state.currentResults) {
        state.savedResults.push({ ...state.currentResults });
      }
    },
    clearCurrentResults: (state) => {
      state.currentResults = null;
    },
    setComparisonResults: (state, action: PayloadAction<SimulationResults>) => {
      state.comparisonResults = action.payload;
      state.isComparing = true;
    },
    clearComparisonResults: (state) => {
      state.comparisonResults = null;
      state.isComparing = false;
    },
    deleteSavedResult: (state, action: PayloadAction<number>) => {
      state.savedResults.splice(action.payload, 1);
    }
  }
});

export const { 
  initializeResults, 
  addPossession, 
  completeSimulationRun, 
  saveResults,
  clearCurrentResults,
  setComparisonResults,
  clearComparisonResults,
  deleteSavedResult
} = resultsSlice.actions;

export default resultsSlice.reducer;