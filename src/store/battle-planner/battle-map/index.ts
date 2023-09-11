import { combineReducers } from '@reduxjs/toolkit';
import { EqualityFn, useSelector } from 'react-redux';

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

type BattleMapState = ReturnType<typeof battleMapReducers>;
type PartialBaseState = { battlePlanner: { battleMap: BattleMapState } };

/**
 * Selector to be used specifically with the battlePlanner.battleMap slice.
 */
export function useBattleMapSelector<TSelected>(
  selector: (state: BattleMapState) => TSelected,
  equalityFn?: EqualityFn<TSelected>,
) {
  return <TSelected>useSelector(
    (state: PartialBaseState) => selector(state.battlePlanner.battleMap),
    equalityFn,
  );
}
