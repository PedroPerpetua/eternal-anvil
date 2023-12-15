import { TypedUseSelectorHook, useSelector } from 'react-redux';

import calculatorsSliceReducer from './calculatorsSlice';
import type { RootState } from '..';

const distanceCalculatorReducers = calculatorsSliceReducer;

export default distanceCalculatorReducers;

type DistanceCalculatorUseSelectorHook = TypedUseSelectorHook<RootState['distanceCalculator']>;

export const useDistanceCalculatorSelector: DistanceCalculatorUseSelectorHook = (
  (selector, options) => useSelector(
    (state: RootState) => selector(state.distanceCalculator),
    // @ts-ignore
    options,
  )
);
