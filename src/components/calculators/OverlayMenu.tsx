import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import {
  Box, Fade, Stack, Tooltip, Typography, useMediaQuery, useTheme,
} from '@mui/material';
import type { SvgIcon } from '@mui/material';

import useCalculatorsDisplayMode from './useCalculatorsDisplayMode';
import { useAppDispatch } from '../../store';
import { calculatorsActions } from '../../store/calculators';
import { gameColors } from '../../theme';
import PrimaryFabGameButton from '../common/styled/PrimaryFabGameButton';

type MenuButtonProps = {
  Icon: typeof SvgIcon,
  label: string,
  onClick: () => void;
  open: boolean,
};

function MenuButton({ Icon, label, onClick, open }: MenuButtonProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  return (
    <Tooltip open={!isMobile && open} title={<Typography>{ label }</Typography>} placement="left">
      <PrimaryFabGameButton
        color="primary"
        size={isMobile ? 'small' : 'medium'}
        onClick={() => onClick()}
        variant="circular"
      >
        <Icon htmlColor={gameColors.goldIcon} />
      </PrimaryFabGameButton>
    </Tooltip>
  );
}

function OverlayMenu() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useAppDispatch();
  const displayMode = useCalculatorsDisplayMode();
  const [open, setOpen] = useState(false);

  return (
    <Box position="absolute" bottom="35px" right="10px">
      <Stack spacing={1} alignItems="center">
        <Fade in={open}>
          <Stack spacing={1}>
            <MenuButton
              Icon={AddIcon}
              label="Add calculator"
              onClick={() => dispatch(calculatorsActions.createCalculator())}
              open={open}
            />
            {
              !isMobile && (
                <MenuButton
                  Icon={displayMode === 'grid' ? WavingHandIcon : Grid3x3Icon}
                  label={`Change to ${displayMode === 'grid' ? 'Free-Drag' : 'Grid'}`}
                  onClick={() => dispatch(calculatorsActions.setDisplayMode(
                    displayMode === 'grid'
                      ? 'free-drag'
                      : 'grid',
                  ))}
                  open={open}
                />
              )
            }
            <MenuButton
              Icon={VisibilityOffIcon}
              label="Hide calculators"
              onClick={() => dispatch(calculatorsActions.setShow(false))}
              open={open}
            />
            <MenuButton
              Icon={ShareIcon}
              label="Take screenshot of multiple"
              onClick={() => dispatch(calculatorsActions.setShowSelectMultiple(true))}
              open={open}
            />
          </Stack>
        </Fade>
        <PrimaryFabGameButton size="large" color="primary" onClick={() => setOpen((curr) => !curr)}>
          <MenuIcon htmlColor={gameColors.goldIcon} />
        </PrimaryFabGameButton>
      </Stack>
    </Box>
  );
}

export default OverlayMenu;
