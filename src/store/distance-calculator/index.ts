import { TypedUseSelectorHook, useSelector } from 'react-redux';

import tabsSliceReducer from './tabsSlice';
import type { RootState } from '..';

const distanceCalculatorReducers = tabsSliceReducer;

export default distanceCalculatorReducers;

type DistanceCalculatorUseSelectorHook = TypedUseSelectorHook<RootState['distanceCalculator']>;

export const useDistanceCalculatorSelector: DistanceCalculatorUseSelectorHook = (
  (selector, options) => useSelector(
    (state: RootState) => selector(state.distanceCalculator),
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    options,
  )
);
