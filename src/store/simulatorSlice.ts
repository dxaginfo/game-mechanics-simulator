import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Team = {
  name: string;
  offensiveRating: number;
  defensiveRating: number;
  threePointPercentage: number;
  midRangePercentage: number;
  insidePercentage: number;
  freeThrowPercentage: number;
  pacePreference: number; // 1-10 scale (slow to fast)
  shotSelectionBias: {
    threePoint: number; // Percentage of shots taken from 3
    midRange: number;  // Percentage of shots taken from mid-range
    inside: number;    // Percentage of shots taken from inside
  };
};

export type GameRules = {
  shotClockDuration: number; // in seconds
  threePointDistance: number; // in feet
  bonusThreshold: number; // number of fouls before bonus
  quarterLength: number; // in minutes
  overtimeLength: number; // in minutes
};

export type GameState = {
  homeScore: number;
  awayScore: number;
  timeRemaining: number; // in seconds
  quarter: number;
  homeTeamFouls: number;
  awayTeamFouls: number;
  homePossession: boolean;
  timeouts: {
    home: number;
    away: number;
  };
};

interface SimulatorState {
  homeTeam: Team;
  awayTeam: Team;
  gameRules: GameRules;
  gameState: GameState;
  isSimulating: boolean;
  simulationSpeed: number; // 1-5 scale
}

const initialState: SimulatorState = {
  homeTeam: {
    name: 'Home Team',
    offensiveRating: 110,
    defensiveRating: 108,
    threePointPercentage: 0.36,
    midRangePercentage: 0.42,
    insidePercentage: 0.62,
    freeThrowPercentage: 0.78,
    pacePreference: 6,
    shotSelectionBias: {
      threePoint: 0.35,
      midRange: 0.25,
      inside: 0.4
    }
  },
  awayTeam: {
    name: 'Away Team',
    offensiveRating: 108,
    defensiveRating: 110,
    threePointPercentage: 0.34,
    midRangePercentage: 0.40,
    insidePercentage: 0.58,
    freeThrowPercentage: 0.76,
    pacePreference: 5,
    shotSelectionBias: {
      threePoint: 0.32,
      midRange: 0.30,
      inside: 0.38
    }
  },
  gameRules: {
    shotClockDuration: 24,
    threePointDistance: 23.75,
    bonusThreshold: 5,
    quarterLength: 12,
    overtimeLength: 5
  },
  gameState: {
    homeScore: 0,
    awayScore: 0,
    timeRemaining: 12 * 60, // 12 minutes in seconds
    quarter: 1,
    homeTeamFouls: 0,
    awayTeamFouls: 0,
    homePossession: true,
    timeouts: {
      home: 7,
      away: 7
    }
  },
  isSimulating: false,
  simulationSpeed: 3
};

const simulatorSlice = createSlice({
  name: 'simulator',
  initialState,
  reducers: {
    updateHomeTeam: (state, action: PayloadAction<Partial<Team>>) => {
      state.homeTeam = { ...state.homeTeam, ...action.payload };
    },
    updateAwayTeam: (state, action: PayloadAction<Partial<Team>>) => {
      state.awayTeam = { ...state.awayTeam, ...action.payload };
    },
    updateGameRules: (state, action: PayloadAction<Partial<GameRules>>) => {
      state.gameRules = { ...state.gameRules, ...action.payload };
      
      // Reset game state if game rules change
      state.gameState.timeRemaining = state.gameRules.quarterLength * 60;
    },
    updateGameState: (state, action: PayloadAction<Partial<GameState>>) => {
      state.gameState = { ...state.gameState, ...action.payload };
    },
    setSimulationStatus: (state, action: PayloadAction<boolean>) => {
      state.isSimulating = action.payload;
    },
    setSimulationSpeed: (state, action: PayloadAction<number>) => {
      state.simulationSpeed = action.payload;
    },
    resetSimulation: (state) => {
      state.gameState = {
        homeScore: 0,
        awayScore: 0,
        timeRemaining: state.gameRules.quarterLength * 60,
        quarter: 1,
        homeTeamFouls: 0,
        awayTeamFouls: 0,
        homePossession: true,
        timeouts: {
          home: 7,
          away: 7
        }
      };
    },
    scorePoints: (state, action: PayloadAction<{ team: 'home' | 'away', points: number }>) => {
      const { team, points } = action.payload;
      
      if (team === 'home') {
        state.gameState.homeScore += points;
        state.gameState.homePossession = false;
      } else {
        state.gameState.awayScore += points;
        state.gameState.homePossession = true;
      }
    },
    advanceTime: (state, action: PayloadAction<number>) => {
      // time in seconds
      const time = action.payload;
      
      if (state.gameState.timeRemaining <= time) {
        // End of quarter
        if (state.gameState.quarter < 4) {
          // Move to next quarter
          state.gameState.quarter += 1;
          state.gameState.timeRemaining = state.gameRules.quarterLength * 60;
          
          // Reset fouls
          state.gameState.homeTeamFouls = 0;
          state.gameState.awayTeamFouls = 0;
          
          // Alternate possession
          state.gameState.homePossession = !state.gameState.homePossession;
        } else {
          // End of regulation
          if (state.gameState.homeScore === state.gameState.awayScore) {
            // Overtime
            state.gameState.quarter += 1;
            state.gameState.timeRemaining = state.gameRules.overtimeLength * 60;
            
            // Reset fouls
            state.gameState.homeTeamFouls = 0;
            state.gameState.awayTeamFouls = 0;
          } else {
            // Game over
            state.gameState.timeRemaining = 0;
            state.isSimulating = false;
          }
        }
      } else {
        // Just advance time
        state.gameState.timeRemaining -= time;
      }
    },
    callTimeout: (state, action: PayloadAction<'home' | 'away'>) => {
      const team = action.payload;
      
      if (team === 'home' && state.gameState.timeouts.home > 0) {
        state.gameState.timeouts.home -= 1;
      } else if (team === 'away' && state.gameState.timeouts.away > 0) {
        state.gameState.timeouts.away -= 1;
      }
    },
    addFoul: (state, action: PayloadAction<'home' | 'away'>) => {
      const team = action.payload;
      
      if (team === 'home') {
        state.gameState.homeTeamFouls += 1;
      } else {
        state.gameState.awayTeamFouls += 1;
      }
    }
  }
});

export const { 
  updateHomeTeam, 
  updateAwayTeam, 
  updateGameRules, 
  updateGameState,
  setSimulationStatus,
  setSimulationSpeed,
  resetSimulation,
  scorePoints,
  advanceTime,
  callTimeout,
  addFoul
} = simulatorSlice.actions;

export default simulatorSlice.reducer;