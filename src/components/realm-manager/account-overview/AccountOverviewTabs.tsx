import type { PropsWithChildren } from 'react';
import { Box } from '@mui/material';
import type { ButtonProps } from '@mui/material';
import { useParams } from 'react-router-dom';

import GameButton from '../../common/styled/GameButton';

export type TabValue = 'realm' | 'account';

type TabButtonProps = ButtonProps & {
  value: TabValue
};

export function TabButton({ value, ...props }: TabButtonProps) {
  const { accountId, view } = useParams();
  return (
    <GameButton
      color="teal"
      sx={{ borderColor: 'secondary.main', minWidth: 'min(33%, 180px)' }}
      href={`/realm-manager/${accountId}/${value}`}
      selected={view === value}
      {...props}
    />
  );
}

type TabProps = PropsWithChildren<{
  value: TabValue
}>;

export function Tab({ value, children }: TabProps) {
  const { view } = useParams();
  if (view !== value) return null;
  return (
    <Box sx={{ marginTop: '15px' }}>
      { children }
    </Box>
  );
}
