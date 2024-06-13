import { PropsWithChildren } from 'react';
import { Stack, Container } from '@mui/material';

import Footer from './Footer';
import Header from './Header';
import { backgroundColor } from '../../theme';

type WebsiteLayoutProps = PropsWithChildren<object>;

function WebsiteLayout({ children }: WebsiteLayoutProps) {
  return (
    <Stack sx={{ backgroundColor, height: '100dvh' }}>
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
    </Stack>
  );
}

export default WebsiteLayout;
