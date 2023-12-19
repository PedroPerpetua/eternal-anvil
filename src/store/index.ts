import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import battlePlannerReducers from './battle-planner';
import distanceCalculatorReducers from './distance-calculator';
import { listenerMiddleware } from './listenerMiddleware';

const store = configureStore({
  reducer: {
    battlePlanner: battlePlannerReducers,
    distanceCalculator: distanceCalculatorReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware),
});

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;

export default store;
