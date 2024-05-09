import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100vw',
        backgroundColor: 'gray',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="caption" color="initial">
        Copyright ©
        { new Date().getFullYear() }
        { ' ' }
        Pedro Perpétua
      </Typography>
    </Box>
  );
}

export default Footer;
