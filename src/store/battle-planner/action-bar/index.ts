import { combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useSelector } from 'react-redux';

import addStructureTabReducer from './addStructureTabSlice';
import currentTabReducer from './currentTabSlice';
import edgesTabReducer from './edgesTabSlice';
import type { RootState } from '../..';

const actionBarReducers = combineReducers({
  currentTab: currentTabReducer,
  addStructureTab: addStructureTabReducer,
  edgesTab: edgesTabReducer,
});

export default actionBarReducers;

type ActionBarUseSelectorHook = TypedUseSelectorHook<RootState['battlePlanner']['actionBar']>;
/**
 * Selector to be used specifically with the battlePlanner.actionBar slice.
 */
export const useActionBarSelector: ActionBarUseSelectorHook = (selector, options) => useSelector(
  (state: RootState) => selector(state.battlePlanner.actionBar),
  // @ts-ignore
  options,
);
