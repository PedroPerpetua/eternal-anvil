import { Stack, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';
import { backgroundColor } from '../../theme';

function WebsiteLayout() {
  return (
    <Stack sx={{ backgroundColor, height: '100dvh' }}>
      <Header />
      <Container
        maxWidth="xl"
        sx={{ minHeight: '100%', padding: '25px' }}
      >
        <Outlet />
      </Container>
      <Footer />
    </Stack>
  );
}

export default WebsiteLayout;
