import { combineReducers } from '@reduxjs/toolkit';

import addStructureTabReducer from './addStructureTabSlice';
import currentTabReducer from './currentTabSlice';
import edgesTabReducer from './edgesTabSlice';
import realmsTabSlice from './realmsTabSlice';

const actionBarReducers = combineReducers({
  currentTab: currentTabReducer,
  addStructureTab: addStructureTabReducer,
  realmsTab: realmsTabSlice,
  edgesTab: edgesTabReducer,
});

export default actionBarReducers;
