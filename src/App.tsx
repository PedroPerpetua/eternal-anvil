import { Stack } from '@mui/material';

import CalculatorsOverlay from './components/calculators/CalculatorsOverlay';
import ShowCalculatorsButton from './components/calculators/ShowCalculatorsButton';
import About from './components/website/About';
import Donations from './components/website/Donations';
import WebsiteLayout from './components/website/WebsiteLayout';

function App() {
  return (
    <>
      <WebsiteLayout>
        <Stack spacing={1}>
          <ShowCalculatorsButton />
          <About />
          <Donations />
        </Stack>
      </WebsiteLayout>
      <CalculatorsOverlay />
    </>
  );
}

export default App;
