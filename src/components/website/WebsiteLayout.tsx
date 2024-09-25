import { Stack, Container, Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

import SideNavigation from './side-navigation/SideNavigation';
import Tools from './Tools';
import CalculatorsOverlay from '../calculators/CalculatorsOverlay';

function WebsiteLayout() {
  return (
    <>
      <Stack sx={{ display: 'flex', backgroundColor: 'background.default', height: '100dvh' }}>
        <SideNavigation />
        <Box sx={{ display: 'flex', flexGrow: 1, overflowY: 'auto' }}>
          <Container component="main" sx={{ flexGrow: 1, padding: '25px' }}>
            <Outlet />
          </Container>
        </Box>
      </Stack>
      <Tools />
      <CalculatorsOverlay />
    </>
  );
}

export default WebsiteLayout;
