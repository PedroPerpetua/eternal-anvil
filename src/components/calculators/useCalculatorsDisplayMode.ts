import { useTheme, useMediaQuery } from '@mui/material';

import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import type { DisplayMode } from '../../store/calculators';

function useCalculatorsDisplayMode(): DisplayMode {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const displayMode = useAppSelector(calculatorsSelectors.displayMode);

  if (isMobile) return 'grid';
  return displayMode;
}

export default useCalculatorsDisplayMode;
