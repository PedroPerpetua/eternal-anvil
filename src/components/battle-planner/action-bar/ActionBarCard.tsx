import { PropsWithChildren } from 'react';
import { Paper, useTheme } from '@mui/material';

import { TabId, useActionBarContext } from './ActionBarContext';

type ActionBarCardProps = PropsWithChildren<{
  value: TabId
}>;

function ActionBarCard({ value, children }: ActionBarCardProps) {
  const theme = useTheme();
  const { currentTab } = useActionBarContext();
  if (currentTab !== value) return null;
  return (
    <Paper
      elevation={0}
      sx={{
        padding: '25px',
        border: '1px solid black',
        backgroundColor: theme.palette.tabButton.main,
        width: '100%',
      }}
    >
      { children }
    </Paper>
  );
}

export default ActionBarCard;
