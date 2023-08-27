import { Button, useTheme } from '@mui/material';

import { TabId, useActionBarContext } from './ActionBarContext';
import useTintedImage from '../../../hooks/useTintedImage';
import CustomIcon from '../../common/CustomIcon';

type ActionBarButtonProps = {
  value: TabId,
  iconSrc: string,
};

function ActionBarButton({ value, iconSrc }: ActionBarButtonProps) {
  const theme = useTheme();
  const { currentTab, setCurrentTab } = useActionBarContext();
  const icon = useTintedImage(iconSrc, '#d8bc68');
  const isSelected = currentTab === value;
  return (
    <Button
      sx={{
        backgroundColor: isSelected
          ? theme.palette.gameButtonBackground.light
          : theme.palette.gameButtonBackground.main,
        '&:hover': {
          backgroundColor: theme.palette.gameButtonBackground.light,
        },
      }}
      onClick={() => setCurrentTab(isSelected ? null : value)}
    >
      <CustomIcon src={icon} />
    </Button>
  );
}

export default ActionBarButton;
