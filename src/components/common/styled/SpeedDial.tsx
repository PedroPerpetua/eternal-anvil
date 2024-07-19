import { createContext, useContext, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';
import {
  Box, Fade, Stack, Tooltip, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import type { SvgIcon } from '@mui/material';

import FabGameButton from './FabGameButton';

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
      <FabGameButton
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        onClick={() => {
          if (closeOnClick) setOpen(false);
          onClick();
        }}
        variant="circular"
      >
        <IconComponent htmlColor={theme.palette.secondary.icon} />
      </FabGameButton>
    </Tooltip>
  );
}

type SpeedDialProps = PropsWithChildren<{
  IconComponent: typeof SvgIcon
}>;

function SpeedDial({ IconComponent, children }: SpeedDialProps) {
  const theme = useTheme();
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
        <FabGameButton color="primary" size="large" onClick={() => setOpen((curr) => !curr)}>
          <IconComponent htmlColor={theme.palette.secondary.icon} />
        </FabGameButton>
      </Stack>
    </Box>
  );
}

SpeedDial.MenuButton = SpeedDialMenuButton;

export default SpeedDial;
