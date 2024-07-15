import { Stack, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

import SideNavigation from './side-navigation/SideNavigation';
import Tools from './Tools';
import CalculatorsOverlay from '../calculators/CalculatorsOverlay';

function WebsiteLayout() {
  return (
    <>
      <Stack sx={{ backgroundColor: 'background.default', height: '100dvh' }}>
        <SideNavigation />
        <Container component="main" sx={{ flexGrow: 1, minHeight: '100%', padding: '25px' }}>
          <Outlet />
        </Container>
      </Stack>
      <Tools />
      <CalculatorsOverlay />
    </>
  );
}

export default WebsiteLayout;
