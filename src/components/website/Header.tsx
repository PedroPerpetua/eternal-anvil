import {
  AppBar, Toolbar, Typography, Box, Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import LanguageSelector from './LanguageSelector';
import UserHeader from './UserHeader';
import WebsiteIcon from '../../assets/icon.png';
import CustomIcon from '../common/CustomIcon';

function Header() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Stack
            direction="row"
            onClick={() => navigate('/')}
            sx={{
              width: 'fit-content',
              alignItems: 'center',
              userSelect: 'none',
              cursor: 'pointer',
            }}
          >
            <CustomIcon src={WebsiteIcon} size={50} sx={{ margin: '5px' }} />
            <Box>
              <Typography variant="h6" fontWeight="bolder">
                Eternal Anvil
              </Typography>
              <Typography fontSize="12px" fontWeight="bold" fontStyle="italic">
                { t('website.header.subtitle') }
              </Typography>
            </Box>
          </Stack>
        </Box>
        <Stack direction="row" spacing={1}>
          <UserHeader />
          <LanguageSelector />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
