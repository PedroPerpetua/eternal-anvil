import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

import LanguageSelector from './LanguageSelector';
import WebsiteIcon from '../../assets/icon.png';
import CustomIcon from '../common/CustomIcon';

function Header() {
  const { t } = useTranslation();
  return (
    <AppBar position="static">
      <Toolbar>
        <CustomIcon src={WebsiteIcon} size={50} sx={{ margin: '5px' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bolder">
            Eternal Anvil
          </Typography>
          <Typography fontSize="12px" fontWeight="bold" fontStyle="italic">
            { t('website.header.subtitle') }
          </Typography>
        </Box>
        <LanguageSelector />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
