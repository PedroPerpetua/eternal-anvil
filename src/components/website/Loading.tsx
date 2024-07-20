import { Box, CircularProgress } from '@mui/material';

import useElementDimensions from '../common/useElementDimensions';

function Loading() {
  // We get the actual dimensions as a number because the CircularProgress doesn't like %
  const { ref, width, height } = useElementDimensions();
  const percentage = 0.1;
  const size = Math.min(width * percentage, height * percentage);
  return (
    <Box
      ref={ref}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <CircularProgress size={size} />
    </Box>
  );
}

export default Loading;
