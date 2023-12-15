import { combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import edgesReducer from './edgesSlice';
import mapInfoReducer from './mapInfoSlice';
import realmsReducer from './realmsSlice';
import structuresReducer from './structuresSlice';
import type { RootState } from '../..';

const battleMapReducers = combineReducers({
  realms: realmsReducer,
  structures: structuresReducer,
  edges: edgesReducer,
  mapInfo: mapInfoReducer,
});

export default battleMapReducers;

type BattleMapUseSelectorHook = TypedUseSelectorHook<RootState['battlePlanner']['battleMap']>;
/**
 * Selector to be used specifically with the battlePlanner.actionBar slice.
 */
export const useBattleMapSelector: BattleMapUseSelectorHook = (selector, options) => useSelector(
  (state: RootState) => selector(state.battlePlanner.battleMap),
  // @ts-ignore
  options,
);
