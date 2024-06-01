import { styled } from '@mui/material';

import GameButton from './GameButton';

const PrimaryGameButton = styled(GameButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.primary.dark },
}));

export default PrimaryGameButton;
