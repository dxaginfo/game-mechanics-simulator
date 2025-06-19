import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Team, GameRules, GameState } from './simulatorSlice';

export interface Scenario {
  id: string;
  name: string;
  description: string;
  homeTeam: Team;
  awayTeam: Team;
  gameRules: GameRules;
  gameState: GameState;
}

interface ScenariosState {
  scenarios: Scenario[];
  activeScenarioId: string | null;
}

const initialLateGameScenario: Scenario = {
  id: 'late-game',
  name: 'Late Game Situation',
  description: 'Test end-of-game strategies with 24 seconds left and down by 2',
  homeTeam: {
    name: 'Home Team',
    offensiveRating: 112,
    defensiveRating: 110,
    threePointPercentage: 0.37,
    midRangePercentage: 0.44,
    insidePercentage: 0.65,
    freeThrowPercentage: 0.80,
    pacePreference: 7,
    shotSelectionBias: {
      threePoint: 0.38,
      midRange: 0.22,
      inside: 0.40
    }
  },
  awayTeam: {
    name: 'Away Team',
    offensiveRating: 108,
    defensiveRating: 105,
    threePointPercentage: 0.33,
    midRangePercentage: 0.41,
    insidePercentage: 0.60,
    freeThrowPercentage: 0.75,
    pacePreference: 4,
    shotSelectionBias: {
      threePoint: 0.30,
      midRange: 0.28,
      inside: 0.42
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
    homeScore: 98,
    awayScore: 100,
    timeRemaining: 24, // 24 seconds
    quarter: 4,
    homeTeamFouls: 3,
    awayTeamFouls: 4,
    homePossession: true,
    timeouts: {
      home: 2,
      away: 1
    }
  }
};

const initialPaceAnalysisScenario: Scenario = {
  id: 'pace-impact',
  name: 'Pace Impact Analysis',
  description: 'See how changing the shot clock affects scoring and efficiency',
  homeTeam: {
    name: 'Fast-Paced Team',
    offensiveRating: 115,
    defensiveRating: 112,
    threePointPercentage: 0.38,
    midRangePercentage: 0.42,
    insidePercentage: 0.62,
    freeThrowPercentage: 0.78,
    pacePreference: 9,
    shotSelectionBias: {
      threePoint: 0.40,
      midRange: 0.15,
      inside: 0.45
    }
  },
  awayTeam: {
    name: 'Slow-Paced Team',
    offensiveRating: 108,
    defensiveRating: 104,
    threePointPercentage: 0.36,
    midRangePercentage: 0.44,
    insidePercentage: 0.58,
    freeThrowPercentage: 0.80,
    pacePreference: 3,
    shotSelectionBias: {
      threePoint: 0.30,
      midRange: 0.35,
      inside: 0.35
    }
  },
  gameRules: {
    shotClockDuration: 24, // Users can modify this to test impact
    threePointDistance: 23.75,
    bonusThreshold: 5,
    quarterLength: 12,
    overtimeLength: 5
  },
  gameState: {
    homeScore: 0,
    awayScore: 0,
    timeRemaining: 12 * 60, // Full quarter
    quarter: 1,
    homeTeamFouls: 0,
    awayTeamFouls: 0,
    homePossession: true,
    timeouts: {
      home: 7,
      away: 7
    }
  }
};

const initialThreePointScenario: Scenario = {
  id: 'three-point-revolution',
  name: 'Three-Point Revolution',
  description: 'Adjust three-point line distance to see impact on shot selection',
  homeTeam: {
    name: 'Three-Point Team',
    offensiveRating: 114,
    defensiveRating: 110,
    threePointPercentage: 0.40,
    midRangePercentage: 0.41,
    insidePercentage: 0.60,
    freeThrowPercentage: 0.82,
    pacePreference: 7,
    shotSelectionBias: {
      threePoint: 0.45,
      midRange: 0.20,
      inside: 0.35
    }
  },
  awayTeam: {
    name: 'Inside Team',
    offensiveRating: 110,
    defensiveRating: 108,
    threePointPercentage: 0.33,
    midRangePercentage: 0.42,
    insidePercentage: 0.65,
    freeThrowPercentage: 0.75,
    pacePreference: 5,
    shotSelectionBias: {
      threePoint: 0.25,
      midRange: 0.30,
      inside: 0.45
    }
  },
  gameRules: {
    shotClockDuration: 24,
    threePointDistance: 23.75, // Users can modify this
    bonusThreshold: 5,
    quarterLength: 12,
    overtimeLength: 5
  },
  gameState: {
    homeScore: 0,
    awayScore: 0,
    timeRemaining: 12 * 60,
    quarter: 1,
    homeTeamFouls: 0,
    awayTeamFouls: 0,
    homePossession: true,
    timeouts: {
      home: 7,
      away: 7
    }
  }
};

const initialFoulStrategyScenario: Scenario = {
  id: 'foul-strategy',
  name: 'Foul Strategy Optimizer',
  description: 'Determine optimal fouling strategies in end-game situations',
  homeTeam: {
    name: 'Trailing Team',
    offensiveRating: 112,
    defensiveRating: 109,
    threePointPercentage: 0.38,
    midRangePercentage: 0.43,
    insidePercentage: 0.62,
    freeThrowPercentage: 0.78,
    pacePreference: 8,
    shotSelectionBias: {
      threePoint: 0.40,
      midRange: 0.22,
      inside: 0.38
    }
  },
  awayTeam: {
    name: 'Leading Team',
    offensiveRating: 110,
    defensiveRating: 107,
    threePointPercentage: 0.36,
    midRangePercentage: 0.42,
    insidePercentage: 0.60,
    freeThrowPercentage: 0.70, // Intentionally lower for scenario
    pacePreference: 4,
    shotSelectionBias: {
      threePoint: 0.32,
      midRange: 0.28,
      inside: 0.40
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
    homeScore: 95,
    awayScore: 98,
    timeRemaining: 45, // 45 seconds
    quarter: 4,
    homeTeamFouls: 3,
    awayTeamFouls: 3,
    homePossession: false, // Away team has the ball
    timeouts: {
      home: 2,
      away: 2
    }
  }
};

const initialState: ScenariosState = {
  scenarios: [
    initialLateGameScenario,
    initialPaceAnalysisScenario,
    initialThreePointScenario,
    initialFoulStrategyScenario
  ],
  activeScenarioId: null
};

const scenariosSlice = createSlice({
  name: 'scenarios',
  initialState,
  reducers: {
    addScenario: (state, action: PayloadAction<Scenario>) => {
      state.scenarios.push(action.payload);
    },
    updateScenario: (state, action: PayloadAction<Partial<Scenario> & { id: string }>) => {
      const { id, ...updates } = action.payload;
      const scenario = state.scenarios.find(s => s.id === id);
      
      if (scenario) {
        Object.assign(scenario, updates);
      }
    },
    deleteScenario: (state, action: PayloadAction<string>) => {
      state.scenarios = state.scenarios.filter(s => s.id !== action.payload);
      
      if (state.activeScenarioId === action.payload) {
        state.activeScenarioId = null;
      }
    },
    setActiveScenario: (state, action: PayloadAction<string>) => {
      state.activeScenarioId = action.payload;
    },
    clearActiveScenario: (state) => {
      state.activeScenarioId = null;
    }
  }
});

export const { 
  addScenario, 
  updateScenario, 
  deleteScenario, 
  setActiveScenario,
  clearActiveScenario
} = scenariosSlice.actions;

export default scenariosSlice.reducer;