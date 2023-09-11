import { combineReducers } from '@reduxjs/toolkit';
import { EqualityFn, useSelector } from 'react-redux';

import currentTabReducer from './currentTabSlice';

const actionBarReducers = combineReducers({
  currentTab: currentTabReducer,
});

export default actionBarReducers;

type ActionBarState = ReturnType<typeof actionBarReducers>;
type PartialBaseState = { battlePlanner: { actionBar: ActionBarState } };

/**
 * Selector to be used specifically with the battlePlanner.actionBar slice.
 */
export function useActionBarSelector<TSelected>(
  selector: (state: ActionBarState) => TSelected,
  equalityFn?: EqualityFn<TSelected>,
) {
  return <TSelected>useSelector(
    (state: PartialBaseState) => selector(state.battlePlanner.actionBar),
    equalityFn,
  );
}
