import type { PropsWithChildren } from 'react';

import { useAppSelector } from '../../../store';
import { currentTabSelectors } from '../../../store/battle-planner/action-bar/currentTabSlice';
import type { ActionBarTabId } from '../../../store/battle-planner/action-bar/currentTabSlice';
import GildedPaper from '../../common/styled-components/GildedPaper';

type ActionBarCardProps = PropsWithChildren<{
  tabId: ActionBarTabId
}>;

function ActionBarCard({ tabId, children }: ActionBarCardProps) {
  const isActive = useAppSelector((state) => currentTabSelectors.tabIsActive(state, tabId));
  if (!isActive) return null;
  return (
    // Apply minWidth=0 so it doesn't expand past the rest of the flexbox
    <GildedPaper elevation={0} sx={{ padding: '25px', flex: 1, minWidth: 0 }}>
      { children }
    </GildedPaper>
  );
}

export default ActionBarCard;
