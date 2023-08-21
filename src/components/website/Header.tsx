import { AppBar, Toolbar, Typography, Box } from '@mui/material';

import WebsiteIcon from '../../assets/icon.png';
import CustomIcon from '../common/CustomIcon';

function Header() {
  return (
    <AppBar position="static">
      <Toolbar>
        <CustomIcon src={WebsiteIcon} size={50} sx={{ margin: '5px' }} />
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" fontWeight="bolder">
            Eternal Anvil
          </Typography>
          <Typography fontSize="12px" fontWeight="bold" fontStyle="italic">
            Arkheim Toolkit
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
