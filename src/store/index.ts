import { configureStore } from '@reduxjs/toolkit';
import simulatorReducer from './simulatorSlice';
import scenariosReducer from './scenariosSlice';
import resultsReducer from './resultsSlice';

export const store = configureStore({
  reducer: {
    simulator: simulatorReducer,
    scenarios: scenariosReducer,
    results: resultsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;