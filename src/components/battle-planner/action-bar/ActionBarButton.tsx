import { Button, Tooltip, useTheme } from '@mui/material';

import { TabId, useActionBarContext } from './ActionBarContext';
import useTintedImage from '../../../hooks/useTintedImage';
import CustomIcon from '../../common/CustomIcon';

type ActionBarButtonProps = {
  value: TabId,
  iconSrc: string,
  tooltip: string,
};

function ActionBarButton({ value, iconSrc, tooltip }: ActionBarButtonProps) {
  const theme = useTheme();
  const { currentTab, setCurrentTab } = useActionBarContext();
  const icon = useTintedImage(iconSrc, '#d8bc68');
  const isSelected = currentTab === value;
  return (
    <Tooltip
      componentsProps={{
        popper: {
          sx: {
            opacity: '0.7',
          },
        },
        tooltip: {
          sx: {
            backgroundColor: 'black',
            border: '1px solid #987f3c',
            outline: '1px solid #745b29',
            borderInline: '1px solid #745b29',
          },
        },
      }}
      title={tooltip}
      placement="left"
    >
      <Button
        sx={{
          backgroundColor: isSelected
            ? theme.palette.tabButton.light
            : theme.palette.tabButton.main,
          '&:hover': {
            backgroundColor: theme.palette.tabButton.light,
          },
        }}
        onClick={() => setCurrentTab(isSelected ? null : value)}
      >
        <CustomIcon src={icon} />
      </Button>
    </Tooltip>
  );
}

export default ActionBarButton;
