import { Box, Stack } from '@mui/material';

import CalculatorsOverlay from '../components/calculators/CalculatorsOverlay';
import ShowCalculatorsButton from '../components/calculators/ShowCalculatorsButton';
import RealmManagerButton from '../components/realm-manager/RealmManagerButton';
import About from '../components/website/About';
import Donations from '../components/website/Donations';

function RootPage() {
  return (
    <Box
      sx={{
        flex: 1,
        height: '100%',
        padding: '25px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={1}>
        <ShowCalculatorsButton />
        <RealmManagerButton />
        <About />
        <Donations />
      </Stack>
      <CalculatorsOverlay />
    </Box>
  );
}

export default RootPage;
