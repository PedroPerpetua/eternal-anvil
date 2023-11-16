import { TypedUseSelectorHook, useSelector } from 'react-redux';

import warlordsSliceReducer from './warlordsSlice';
import type { RootState } from '..';

const distanceCalculatorReducers = warlordsSliceReducer;

export default distanceCalculatorReducers;

type DistanceCalculatorUseSelectorHook = TypedUseSelectorHook<RootState['matchupSimulator']>;

export const useMatchupSimulatorSelector: DistanceCalculatorUseSelectorHook = (
  (selector, options) => useSelector(
    (state: RootState) => selector(state.matchupSimulator),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    options,
  )
);
