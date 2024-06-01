import { styled } from '@mui/material';

import FabGameButton from './FabGameButton';

const PrimaryFabGameButton = styled(FabGameButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
}));

export default PrimaryFabGameButton;
