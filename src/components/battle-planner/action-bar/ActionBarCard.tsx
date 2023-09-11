import { PropsWithChildren } from 'react';

import { useActionBarSelector } from '../../../store/battle-planner/action-bar';
import { ActionBarTabId } from '../../../store/battle-planner/action-bar/currentTabSlice';
import GildedPaper from '../../common/styled-components/GildedPaper';

type ActionBarCardProps = PropsWithChildren<{
  value: ActionBarTabId
}>;

function ActionBarCard({ value, children }: ActionBarCardProps) {
  const current = useActionBarSelector((state) => state.currentTab);
  if (current !== value) return null;
  return (
    // Apply minWidth=0 so it doesn't expand past the rest of the flexbox
    <GildedPaper elevation={0} sx={{ padding: '25px', flex: 1, minWidth: 0 }}>
      { children }
    </GildedPaper>
  );
}

export default ActionBarCard;
