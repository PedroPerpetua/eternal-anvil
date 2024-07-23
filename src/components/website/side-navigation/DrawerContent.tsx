import { Typography, Divider, Box, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import About from './About';
import Donations from './Donations';
import LanguageSelector from './LanguageSelector';
import SideNavigationRoute from './SideNavigationRoute';
import type { SideNavigationRouteProps } from './SideNavigationRoute';
import UserInfo from './UserInfo';
import WebsiteIcon from '../../../assets/icon.png';
import i18n from '../../../translations/i18n';
import CustomIcon from '../../common/CustomIcon';
import RealmManagerSideNavigation from '../../realm-manager/RealmManagerSideNavigation';

const routes: SideNavigationRouteProps[] = [
  {
    route: 'realm-manager',
    label: i18n.t('realmManager.route'),
    requiresAuth: true,
    children: <RealmManagerSideNavigation />,
  },
];

type DrawerContentProps = {
  withHeader?: boolean
};

function DrawerContent({ withHeader }: DrawerContentProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <>
      <Stack spacing={1} sx={{ padding: '5px' }}>
        {
          withHeader && (
            <>
              { /* <Header> */ }
              <Stack
                direction="row"
                onClick={() => navigate('/')}
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '65px',
                }}
                className="clickable"
              >
                <CustomIcon
                  src={WebsiteIcon}
                  size={50}
                  sx={{ position: 'absolute', left: '10px' }}
                />
                <Typography variant="h6" fontWeight="bolder">
                  Eternal Anvil
                </Typography>
              </Stack>
              { /* </Header> */ }
              <Divider />
            </>
          )
        }
        {
          routes.map(({ route, label, requiresAuth, children }) => (
            <SideNavigationRoute
              key={route}
              route={route}
              label={label}
              requiresAuth={requiresAuth}
            >
              { children }
            </SideNavigationRoute>
          ))
        }
      </Stack>
      <Box role="presentation" sx={{ position: 'absolute', bottom: 0, width: '100%' }}>
        <Stack spacing={1} sx={{ padding: '5px' }}>
          <UserInfo />
          <Divider />
          <About />
          <Donations />
          <LanguageSelector />
        </Stack>
        { /* <Footer> */ }
        <Box
          component="footer"
          sx={{
            width: '100%',
            backgroundColor: '#4d4351',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '5px',
          }}
        >
          <Typography variant="caption" color="whitesmoke">
            { t('website.footer', { year: new Date().getFullYear(), developer: 'Pedro Perpétua' }) }
          </Typography>
        </Box>
        { /* </Footer> */ }
      </Box>
    </>
  );
}

export default DrawerContent;
