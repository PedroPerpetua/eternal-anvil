import { PropsWithChildren } from 'react';
import { Box, Container } from '@mui/material';

import Footer from './Footer';
import Header from './Header';
import { backgroundColor } from '../../theme';

type WebsiteLayoutProps = PropsWithChildren<object>;

function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <Box sx={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor,
    }}
    >
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          flex: 1,
          height: '100%',
          padding: '25px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        { children }
      </Container>
      <Footer />
    </Box>
  );
}

export default WebsiteLayout;
