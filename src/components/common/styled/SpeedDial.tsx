import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Box, Fade, Stack, Tooltip, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import type { SvgIcon } from '@mui/material';

import PrimaryFabGameButton from './PrimaryFabGameButton';
import { gameColors } from '../../../theme';

type SpeedDialOpenContextType = {
  open: boolean,
  setOpen: (value: boolean) => void,
};

const SpeedDialOpenContext = createContext<SpeedDialOpenContextType>({
  open: false,
  setOpen: () => {},
});

type SpeedDialMenuButtonProps = {
  IconComponent: typeof SvgIcon,
  label: string,
  onClick: () => void,
  closeOnClick?: boolean,
};

function SpeedDialMenuButton({
  IconComponent,
  label,
  onClick,
  closeOnClick = true,
}: SpeedDialMenuButtonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { open, setOpen } = useContext(SpeedDialOpenContext);
  return (
    <Tooltip open={!isMobile && open} title={<Typography>{ label }</Typography>} placement="left">
      <PrimaryFabGameButton
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        onClick={() => {
          if (closeOnClick) setOpen(false);
          onClick();
        }}
        variant="circular"
      >
        <IconComponent htmlColor={gameColors.goldIcon} />
      </PrimaryFabGameButton>
    </Tooltip>
  );
}

type SpeedDialProps = PropsWithChildren<{
  IconComponent: typeof SvgIcon
}>;

function SpeedDial({ IconComponent, children }: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  const ctxValue = useMemo(() => ({ open, setOpen }), [open]);
  return (
    <Box sx={{ position: 'absolute', bottom: '10px', right: '10px' }}>
      <Stack spacing={1} alignItems="center">
        <Fade in={open}>
          <Stack spacing={1}>
            <SpeedDialOpenContext.Provider value={ctxValue}>
              { children }
            </SpeedDialOpenContext.Provider>
          </Stack>
        </Fade>
        <PrimaryFabGameButton size="large" onClick={() => setOpen((curr) => !curr)}>
          <IconComponent htmlColor={gameColors.goldIcon} />
        </PrimaryFabGameButton>
      </Stack>
    </Box>
  );
}

SpeedDial.MenuButton = SpeedDialMenuButton;

export default SpeedDial;
