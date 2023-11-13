import { Box, Typography } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      className="center-content"
      sx={{ width: '100vw', backgroundColor: 'gray' }}
    >
      <Typography variant="caption" color="initial">
        Copyright ©2023 Pedro Perpétua
      </Typography>
    </Box>
  );
}

export default Footer;
