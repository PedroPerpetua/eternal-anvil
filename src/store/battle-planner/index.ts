import { combineReducers } from '@reduxjs/toolkit';

import actionBarReducers from './action-bar';
import battleMapReducers from './battle-map';

const battlePlannerReducers = combineReducers({
  actionBar: actionBarReducers,
  battleMap: battleMapReducers,
});

export default battlePlannerReducers;
