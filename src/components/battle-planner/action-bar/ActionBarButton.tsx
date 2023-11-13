import { PropsWithChildren, ReactNode } from 'react';

import { useAppDispatch } from '../../../store';
import { useActionBarSelector } from '../../../store/battle-planner/action-bar';
import { ActionBarTabId, changeTab } from '../../../store/battle-planner/action-bar/currentTabSlice';
import GameButton from '../../common/styled-components/GameButton';
import GildedTooltip from '../../common/styled-components/GildedTooltip';

type ActionBarButtonProps = PropsWithChildren<{
  value: ActionBarTabId,
  tooltip: string | ReactNode,
}>;

function ActionBarButton({ value, tooltip, children }: ActionBarButtonProps) {
  const dispatch = useAppDispatch();
  const current = useActionBarSelector((state) => state.currentTab);
  const isSelected = current === value;
  return (
    <GildedTooltip
      title={tooltip}
      placement="left"
    >
      <GameButton
        onClick={() => dispatch(changeTab(isSelected ? null : value))}
        selected={isSelected}
      >
        { children }
      </GameButton>
    </GildedTooltip>
  );
}

export default ActionBarButton;
