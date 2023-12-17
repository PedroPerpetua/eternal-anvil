import { useState } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import {
  Button, Dialog, Grid, Stack, ThemeProvider, Tooltip, Typography,
} from '@mui/material';
import { CRS } from 'leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import { MapContainer } from 'react-leaflet';

import TargetIcon from '../../../../assets/target.png';
import { useAppDispatch } from '../../../../store';
import { setMapInfo } from '../../../../store/battle-planner/battle-map/mapInfoSlice';
import theme from '../../../../theme';
import { EMPTY_POINT, computeAffineMatrix, gameToLeaflet, validCoordinates } from '../../../../utils/math';
import type { Point, Triangle } from '../../../../utils/math';
import { readFileAsURL } from '../../../../utils/utilities';
import CoordinateInput from '../../../common/CoordinateInput';
import CustomIcon from '../../../common/CustomIcon';
import MapImageLayer from '../../../common/MapImageLayer';
import MapMarker from '../../../common/MapMarker';
import DeleteIcon from '../../../common/styled-components/DeleteIcon';

const MARKER_SIZE: [number, number] = [25, 25];
const COLOR_RED = '#8b0000';
const COLOR_GREEN = '#013220';
const COLOR_BLUE = '#00008B';
const COLOR_PURPLE = '#800080';

type CoordinateMarkerProps = {
  color: string,
  position: Point,
  onChange: (p: Point) => void,
};

function CoordinateMarker({ color, position, onChange }: CoordinateMarkerProps) {
  return (
    <MapMarker
      icon={TargetIcon}
      iconColor={color}
      iconSize={MARKER_SIZE}
      markerProps={{
        position,
        draggable: true,
        eventHandlers: {
          drag: (e) => {
            const latLng = (e.target as LeafletMarker).getLatLng();
            onChange([latLng.lat, latLng.lng]);
          },
        },
      }}
    />
  );
}

type CoordinateInputRowProps = {
  label: string,
  targetColor: string,
  value: Point,
  onChange: (p: Point) => void,
};

function CoordinateInputRow({ label, targetColor, value, onChange }: CoordinateInputRowProps) {
  return (
    <>
      <Grid item xs={1}>
        <CustomIcon src={TargetIcon} tintColor={targetColor} />
      </Grid>
      <Grid item xs={4}>
        <Typography>{ label }</Typography>
      </Grid>
      <Grid item xs={7}>
        <CoordinateInput
          value={value}
          onChange={onChange}
        />
      </Grid>
    </>
  );
}

type MarkerData = {
  gamePosition: Point,
  leafletPosition: Point
};

type CustomMapDialogProps = {
  open: boolean,
  handleClose: () => void,
};

function CustomMapDialog({ open, handleClose }: CustomMapDialogProps) {
  const dispatch = useAppDispatch();

  const initialImage = null;
  const [image, setImage] = useState<string | null>(initialImage);

  const initialRedTarget: MarkerData = {
    gamePosition: EMPTY_POINT,
    leafletPosition: [0, -50],
  };
  const [redTarget, setRedTarget] = useState(initialRedTarget);

  const initialBlueTarget: MarkerData = {
    gamePosition: EMPTY_POINT,
    leafletPosition: [0, 0],
  };
  const [blueTarget, setBlueTarget] = useState(initialBlueTarget);

  const initialGreenTarget: MarkerData = {
    gamePosition: EMPTY_POINT,
    leafletPosition: [0, 50],
  };
  const [greenTarget, setGreenTarget] = useState<MarkerData>(initialGreenTarget);

  const initialTestPoint = EMPTY_POINT;
  const [testPoint, setTestPoint] = useState(initialTestPoint);
  const transformationMatrix = computeAffineMatrix(
    [redTarget, blueTarget, greenTarget].map((m) => m.gamePosition) as Triangle,
    [redTarget, blueTarget, greenTarget].map((m) => m.leafletPosition) as Triangle,
  );
  const testPointTransformed = gameToLeaflet(transformationMatrix, testPoint);

  const resetTargets = () => {
    setRedTarget(initialRedTarget);
    setBlueTarget(initialBlueTarget);
    setGreenTarget(initialGreenTarget);
    setTestPoint(initialTestPoint);
  };

  const onClose = () => {
    handleClose();
    // Reset everything
    setImage(initialImage);
    resetTargets();
  };

  const handleImageUpload = async (file: File | null) => {
    if (file === null) return;
    const url = await readFileAsURL(file);
    setImage(url);
  };

  const valid = image !== null && validCoordinates(gameToLeaflet(transformationMatrix, [0, 0]));

  const handleSave = () => {
    if (!valid) return;
    dispatch(setMapInfo({ image, transformationMatrix }));
    onClose();
  };

  return (
    // Leave actionBarTheme context
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{ sx: { padding: '20px', width: '70vw', height: '80vh', maxWidth: 'unset' } }}
      >
        <Grid container width="100%" height="100%">
          <Grid item xs={9} padding="0px 5px">
            <MapContainer
              crs={CRS.Simple}
              center={[0, 0]}
              zoom={1}
              zoomSnap={0.1}
              zoomControl={false}
              maxBoundsViscosity={1}
              style={{ width: '100%', height: '100%', backgroundColor: '#9e8357' }}
            >
              <MapImageLayer image={image} />
              <CoordinateMarker
                color={COLOR_RED}
                position={redTarget.leafletPosition}
                onChange={(p) => setRedTarget((c) => ({ ...c, leafletPosition: p }))}
              />
              <CoordinateMarker
                color={COLOR_GREEN}
                position={greenTarget.leafletPosition}
                onChange={(p) => setGreenTarget((c) => ({ ...c, leafletPosition: p }))}
              />
              <CoordinateMarker
                color={COLOR_BLUE}
                position={blueTarget.leafletPosition}
                onChange={(p) => setBlueTarget((c) => ({ ...c, leafletPosition: p }))}
              />
              {
                validCoordinates(testPointTransformed) && (
                <MapMarker
                  icon={TargetIcon}
                  iconColor={COLOR_PURPLE}
                  iconSize={MARKER_SIZE}
                  markerProps={{ position: testPointTransformed }}
                />
                )
              }
            </MapContainer>
          </Grid>
          <Grid item xs={3} padding="0px 5px">
            <Stack sx={{ height: '100%' }} justifyContent="space-between">
              <Stack direction="row" spacing={1}>
                <Button fullWidth component="label" variant="contained">
                  Upload image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                  />
                </Button>
                <Tooltip title={image !== null ? 'Clear Image' : ''}>
                  <span>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={image === null}
                      onClick={() => setImage(null)}
                    >
                      <DeleteIcon />
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography textAlign="justify">
                    Upload a screenshot of the game, then drag the targets to 3 objects in
                    the screenshot, filling in their in game coordinates.
                    <br />
                    <br />
                    Use the Test Point to verify that it&apos;s correctly calibrated.
                    <br />
                    <br />
                    This works best the more zoomed-out the screenshot is, and the further the 3
                    points.
                    <br />
                    <br />
                  </Typography>
                </Grid>
                <CoordinateInputRow
                  label="Red Point"
                  targetColor={COLOR_RED}
                  value={redTarget.gamePosition}
                  onChange={(p) => setRedTarget((c) => ({ ...c, gamePosition: p }))}
                />
                <CoordinateInputRow
                  label="Green Point"
                  targetColor={COLOR_GREEN}
                  value={greenTarget.gamePosition}
                  onChange={(p) => setGreenTarget((c) => ({ ...c, gamePosition: p }))}
                />

                <CoordinateInputRow
                  label="Blue Point"
                  targetColor={COLOR_BLUE}
                  value={blueTarget.gamePosition}
                  onChange={(p) => setBlueTarget((c) => ({ ...c, gamePosition: p }))}
                />
                <CoordinateInputRow
                  label="Test Point"
                  targetColor={COLOR_PURPLE}
                  value={testPoint}
                  onChange={(p) => setTestPoint(p)}
                />
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="warning"
                    fullWidth
                    size="small"
                    endIcon={<RestartAltIcon />}
                    onClick={() => resetTargets()}
                  >
                    Reset all targets
                  </Button>
                </Grid>
              </Grid>
              <Button variant="contained" onClick={handleSave} fullWidth disabled={!valid}>
                Save
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Dialog>
    </ThemeProvider>
  );
}

export default CustomMapDialog;
