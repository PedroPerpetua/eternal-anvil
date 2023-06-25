import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import SettingsIcon from '@mui/icons-material/Settings';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Avatar, Button, Card, CardContent, CardHeader, Grid, Switch, Typography,
} from '@mui/material';

import ActionBarTab, { ActionBarTabProps } from '../ActionBarTab';

type SettingsTabProps = Omit<ActionBarTabProps, 'children' | 'containerProps'>;

function SettingsTab({ tabNumber, currentTab, hover }: SettingsTabProps) {
  return (
    <ActionBarTab
      tabNumber={tabNumber}
      currentTab={currentTab}
      hover={hover}
      containerProps={{ className: 'settings-tab' }}
    >
      { /* <Card> */ }
      <CardHeader
        avatar={<Avatar><SettingsIcon /></Avatar>}
        title="Battle MapSettings"
        titleTypographyProps={{
          variant: 'h5',
        }}
      />
      <CardContent>
        <Grid container spacing={1}>

          <Grid item xs={6} display="flex" alignItems="center">
            Show all distances
          </Grid>
          <Grid item xs={6} display="flex" alignItems="center" justifyContent="right">
            <Switch />
          </Grid>

          <Grid item xs={6} display="flex" alignItems="center">
            Load custom map
          </Grid>
          <Grid item xs={6} className="center-content">
            <Button variant="contained" startIcon={<ImageIcon />} fullWidth>Upload map</Button>
          </Grid>

          <Grid item xs={6} display="flex" alignItems="center">
            <Typography>Save data to file</Typography>
          </Grid>
          <Grid item xs={3} className="center-content">
            <Button variant="contained" startIcon={<SaveIcon />}>Save</Button>
          </Grid>
          <Grid item xs={3} className="center-content">
            <Button variant="contained" startIcon={<UploadFileIcon />}>Load</Button>
          </Grid>

          <Grid item xs={6} display="flex" alignItems="center">
            Clear all data
          </Grid>
          <Grid item xs={6} className="center-content">
            <Button variant="contained" startIcon={<DeleteForeverIcon />} fullWidth color="error">
              Delete all
            </Button>
          </Grid>

        </Grid>
      </CardContent>
      { /* </Card> */ }
    </ActionBarTab>
  );
}

export default SettingsTab;
