import type { PropsWithChildren, ReactNode } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';
import { currentTabSelectors, currentTabActions } from '../../../store/battle-planner/action-bar/currentTabSlice';
import type { ActionBarTabId } from '../../../store/battle-planner/action-bar/currentTabSlice';
import GameButton from '../../common/styled-components/GameButton';
import GildedTooltip from '../../common/styled-components/GildedTooltip';

type ActionBarButtonProps = PropsWithChildren<{
  tabId: ActionBarTabId,
  tooltip: string | ReactNode,
}>;

function ActionBarButton({ tabId, tooltip, children }: ActionBarButtonProps) {
  const dispatch = useAppDispatch();
  const isActive = useAppSelector((state) => currentTabSelectors.tabIsActive(state, tabId));
  return (
    <GildedTooltip
      title={tooltip}
      placement="left"
    >
      <GameButton
        onClick={() => dispatch(currentTabActions.changeTab(isActive ? null : tabId))}
        selected={isActive}
      >
        { children }
      </GameButton>
    </GildedTooltip>
  );
}

export default ActionBarButton;
