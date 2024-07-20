import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar, Drawer, IconButton, Stack, SwipeableDrawer, Toolbar, Typography, useMediaQuery,
  useTheme,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';

import DrawerContent from './DrawerContent';
import WebsiteIcon from '../../../assets/icon.png';
import CustomIcon from '../../common/CustomIcon';

const commonPaperProps = {
  width: '250px',
  backgroundColor: 'primary.main',
  color: 'primary.contrastText',
};

function MobileDrawer() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <AppBar position="static">
        <Toolbar sx={{ color: 'primary.contrastText' }}>
          <IconButton edge="start" onClick={() => setOpen(true)} color="inherit">
            <MenuIcon />
          </IconButton>
          <Stack
            direction="row"
            onClick={() => navigate('/')}
            sx={{ width: 'fit-content', alignItems: 'center' }}
            className="clickable"
          >
            <CustomIcon src={WebsiteIcon} size={50} sx={{ margin: '5px' }} />
            <Typography variant="h6" fontWeight="bolder">
              Eternal Anvil
            </Typography>
          </Stack>
        </Toolbar>
      </AppBar>
      <SwipeableDrawer
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            ...commonPaperProps,
          },
        }}
      >
        <DrawerContent />
      </SwipeableDrawer>
    </>
  );
}

function DesktopDrawer() {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        '& .MuiDrawer-paper': {
          ...commonPaperProps,
          height: '96vh',
          margin: '2vh',
          borderRadius: '5px',
          border: '1px solid',
          borderColor: 'secondary.light',
          outline: '1px solid',
          outlineColor: 'secondary.dark',
        },
      }}
    >
      <DrawerContent withHeader />
    </Drawer>
  );
}

function SideNavigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  return isMobile ? (<MobileDrawer />) : (<DesktopDrawer />);
}

export default SideNavigation;
