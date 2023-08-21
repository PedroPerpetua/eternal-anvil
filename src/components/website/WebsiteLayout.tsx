import { PropsWithChildren } from 'react';
import { Box, Container } from '@mui/material';

import Footer from './Footer';
import Header from './Header';

type WebsiteLayoutProps = PropsWithChildren<object>;

function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flex: 1 }}>
        { children }
      </Container>
      <Footer />
    </Box>
  );
}

export default WebsiteLayout;
