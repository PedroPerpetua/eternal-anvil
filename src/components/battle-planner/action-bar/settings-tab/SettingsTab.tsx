import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Button, Grid, Switch, Typography, TabProps,
} from '@mui/material';

import SettingsIcon from '../../../../assets/settings-icon.png';
import { HexColor } from '../../../../utils/types';
import { ActionBarTab, ActionBarTabContent } from '../ActionBarTab';

const TAB_NUMBER = 3;
const COLOR: HexColor = '#808080';

export function SettingsTab(tabProps: TabProps) {
  /* eslint-disable-next-line react/jsx-props-no-spreading */
  return <ActionBarTab value={TAB_NUMBER} color={COLOR} iconSrc={SettingsIcon} {...tabProps} />;
}

export function SettingsTabContent() {
  return (
    <ActionBarTabContent
      tabNumber={TAB_NUMBER}
      avatarSrc={SettingsIcon}
      title="Settings"
      backgroundColor={COLOR}
    >
      <Grid container spacing={1}>
        <Grid item xs={8} display="flex" alignItems="center">
          Show all distances
        </Grid>
        <Grid item xs={4} display="flex" alignItems="center" justifyContent="right">
          <Switch />
        </Grid>
        <Grid item xs={12} display="flex" alignItems="center">
          <Button variant="contained" startIcon={<ImageIcon />} fullWidth>Load custom map</Button>
        </Grid>
        <Grid item xs={6} display="flex" alignItems="center">
          <Button variant="contained" startIcon={<SaveIcon />} fullWidth>Save</Button>
        </Grid>
        <Grid item xs={6} className="center-content">
          <Button variant="contained" startIcon={<UploadFileIcon />} fullWidth>Load</Button>
        </Grid>
        <Grid item xs={12} className="center-content">
          <Button variant="contained" startIcon={<DeleteForeverIcon />} fullWidth color="error">
            Clear all data
          </Button>
        </Grid>

      </Grid>
    </ActionBarTabContent>
  );
}
