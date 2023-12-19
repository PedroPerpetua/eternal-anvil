import { combineReducers } from '@reduxjs/toolkit';

import edgesReducer from './edgesSlice';
import mapInfoReducer from './mapInfoSlice';
import realmsReducer from './realmsSlice';
import structuresReducer from './structuresSlice';

const battleMapReducers = combineReducers({
  realms: realmsReducer,
  structures: structuresReducer,
  edges: edgesReducer,
  mapInfo: mapInfoReducer,
});

export default battleMapReducers;
