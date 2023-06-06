import {
  AppBar, Toolbar, Typography, Icon, Box,
} from '@mui/material';

import WebsiteIcon from '../../../assets/icon.png';
import About from '../about/About';

import './Header.scss';

function Header() {
  return (
    <Box>
      <AppBar position="static" id="header" className="noSelect">
        <Toolbar>
          <Icon className="icon">
            <img src={WebsiteIcon} alt="Eternal Anvil" />
          </Icon>
          <div className="title-container">
            <Typography variant="h6" noWrap className="title">Eternal Anvil</Typography>
            <Typography variant="subtitle2" noWrap className="subtitle">Arkheim Toolkit</Typography>
          </div>
          <About />
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default Header;
