import { Box, Typography } from '@mui/material';

import './Footer.scss';

function Footer() {
  return (
    <Box component="footer" id="footer" className="noSelect">
      <Typography variant="caption" color="initial">
        Copyright ©2023 Pedro Perpétua
      </Typography>
    </Box>
  );
}

export default Footer;
