import { PropsWithChildren } from 'react';
import { Paper, useTheme } from '@mui/material';
import { useMap } from 'react-leaflet';

import { TabId, useActionBarContext } from './ActionBarContext';
import { useAppSelector } from '../../../store';

type ActionBarCardProps = PropsWithChildren<{
  value: TabId
}>;

function ActionBarCard({ value, children }: ActionBarCardProps) {
  const map = useMap();
  const dragging = useAppSelector((state) => state.mapInfo.dragging);
  const theme = useTheme();
  const { currentTab } = useActionBarContext();
  if (currentTab !== value) return null;
  return (
    <Paper
      elevation={0}
      sx={{
        padding: '25px',
        border: '1px solid black',
        backgroundColor: theme.palette.gameButtonBackground.main,
        width: '100%',
      }}
      onMouseOver={() => { if (!dragging) map.dragging.disable(); }}
      onMouseOut={() => { if (!dragging) map.dragging.enable(); }}
    >
      { children }
    </Paper>
  );
}

export default ActionBarCard;
