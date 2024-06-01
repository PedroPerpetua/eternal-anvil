import { styled } from '@mui/material';

import GameButton from './GameButton';

const SecondaryGameButton = styled(GameButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  '&:hover': { backgroundColor: theme.palette.secondary.light },
}));

export default SecondaryGameButton;
