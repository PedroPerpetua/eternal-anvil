import { Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();
  return (
    <Box
      component="footer"
      sx={{
        width: '100vw',
        backgroundColor: 'secondary.main',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" color="whitesmoke">
        {
          t('website.footer.copyright', {
            year: new Date().getFullYear(),
            developer: 'Pedro Perpétua',
          })
        }
      </Typography>
    </Box>
  );
}

export default Footer;
