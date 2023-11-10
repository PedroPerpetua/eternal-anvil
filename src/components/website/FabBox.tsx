import { PropsWithChildren } from 'react';
import { Stack } from '@mui/material';

type FabBoxProps = PropsWithChildren<object>;

function FabBox({ children }: FabBoxProps) {
  return (
    <Stack sx={{ position: 'absolute', right: '30px', bottom: 'Calc(30px + 1rem)' }} spacing={1}>
      { children }
    </Stack>
  );
}

export default FabBox;
