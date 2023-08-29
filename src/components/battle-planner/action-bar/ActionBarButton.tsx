import { TabId, useActionBarContext } from './ActionBarContext';
import useTintedImage from '../../../hooks/useTintedImage';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled-components/GameButton';
import GildedTooltip from '../../common/styled-components/GildedTooltip';

type ActionBarButtonProps = {
  value: TabId,
  iconSrc: string,
  tooltip: string,
};

function ActionBarButton({ value, iconSrc, tooltip }: ActionBarButtonProps) {
  const { currentTab, setCurrentTab } = useActionBarContext();
  const icon = useTintedImage(iconSrc, '#d8bc68');
  const isSelected = currentTab === value;
  return (
    <GildedTooltip
      title={tooltip}
      placement="left"
    >
      <GameButton onClick={() => setCurrentTab(isSelected ? null : value)} selected={isSelected}>
        <CustomIcon src={icon} />
      </GameButton>
    </GildedTooltip>
  );
}

export default ActionBarButton;
