import { EqualityFn } from 'react-redux';

import { RootState, useAppSelector } from '..';

/**
 * Selector to be used specifically with the battleMap slice.
 */
function useBattleMapSelector<TSelected>(
  selector: (state: RootState['battleMap']) => TSelected,
  equalityFn?: EqualityFn<TSelected>,
) {
  return <TSelected>useAppSelector((state) => selector(state.battleMap), equalityFn);
}
export default useBattleMapSelector;
