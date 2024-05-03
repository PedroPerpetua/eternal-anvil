import {
  Box, Portal, Stack, useMediaQuery, useTheme,
} from '@mui/material';

import Calculator from './Calculator';
import ShowCalculatorsButton from './ShowCalculatorsButton';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';

function MobileCalculators() {
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);

  return (
    <Stack spacing={2}>
      <ShowCalculatorsButton />
      { calculatorIds.map((id) => (<Calculator key={id} calculatorId={id} />)) }
    </Stack>
  );
}

function CalculatorsOverlay() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const show = useAppSelector(calculatorsSelectors.show);

  if (!show) return null;
  return (
    <Portal>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        { isMobile ? <MobileCalculators /> : null }
      </Box>
    </Portal>
  );
}

export default CalculatorsOverlay;
