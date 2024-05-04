import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Box, Fab, Fade, Stack } from '@mui/material';

import { useAppDispatch } from '../../store';
import { calculatorsActions } from '../../store/calculators';

function MobileMenu() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  return (
    <Box position="absolute" bottom="35px" right="10px">
      <Stack spacing={1} alignItems="center">
        <Fade in={open}>
          <Stack spacing={1}>
            <Fab
              color="primary"
              size="small"
              onClick={() => dispatch(calculatorsActions.createCalculator())}
            >
              <AddIcon />
            </Fab>
            <Fab
              color="primary"
              size="small"
              onClick={() => dispatch(calculatorsActions.setShow(false))}
            >
              <VisibilityOffIcon />
            </Fab>
          </Stack>
        </Fade>
        <Fab color="primary" onClick={() => setOpen((curr) => !curr)}>
          <MenuIcon />
        </Fab>
      </Stack>
    </Box>
  );
}

export default MobileMenu;
