import useTintedImage from '../../../hooks/useTintedImage';
import { useAppDispatch } from '../../../store';
import { useActionBarSelector } from '../../../store/battle-planner/action-bar';
import { ActionBarTabId, changeTab } from '../../../store/battle-planner/action-bar/currentTabSlice';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled-components/GameButton';
import GildedTooltip from '../../common/styled-components/GildedTooltip';

type ActionBarButtonProps = {
  value: ActionBarTabId,
  iconSrc: string,
  tooltip: string,
};

function ActionBarButton({ value, iconSrc, tooltip }: ActionBarButtonProps) {
  const dispatch = useAppDispatch();
  const current = useActionBarSelector((state) => state.currentTab);
  const icon = useTintedImage(iconSrc, '#d8bc68');
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
        <CustomIcon src={icon} />
      </GameButton>
    </GildedTooltip>
  );
}

export default ActionBarButton;
