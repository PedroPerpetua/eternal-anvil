import { useState } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import { Button, Dialog, Grid, ThemeProvider } from '@mui/material';
import { CRS, Marker as LeafletMarker } from 'leaflet';
import { MapContainer, Marker, Popup } from 'react-leaflet';

import { useAppDispatch } from '../../../../store';
import { setMapInfo } from '../../../../store/battleMap/mapInfoSlice';
import theme from '../../../../theme';
import {
  EMPTY_POINT, Point, Triangle, computeAffineMatrix, gameToLeaflet, validCoordinates,
} from '../../../../utils/math';
import { readFileAsURL } from '../../../../utils/utilities';
import CoordinateInput from '../../../common/CoordinateInput';
import MapImageLayer from '../../../common/MapImageLayer';

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
  const [image, setImage] = useState<string | null>(null);
  const [markers, setMarkers] = useState<[MarkerData, MarkerData, MarkerData]>([
    { gamePosition: EMPTY_POINT, leafletPosition: [0, 1] },
    { gamePosition: EMPTY_POINT, leafletPosition: [1.5, -1] },
    { gamePosition: EMPTY_POINT, leafletPosition: [-1.5, -1] },
  ]);
  const [testPoint, setTestPoint] = useState<Point>(EMPTY_POINT);

  const transformationMatrix = computeAffineMatrix(
    markers.map((m) => m.gamePosition) as Triangle,
    markers.map((m) => m.leafletPosition) as Triangle,
  );
  const testPointTransformed = gameToLeaflet(transformationMatrix, testPoint);

  const handleImageUpload = async (file: File | null) => {
    if (file === null) return;
    const url = await readFileAsURL(file);
    setImage(url);
  };

  const handleSave = () => {
    dispatch(setMapInfo({ image, transformationMatrix }));
    handleClose();
  };

  return (
    <ThemeProvider theme={theme}>
      { ' ' }
      { /* Leave actionBarTheme context */ }
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: { padding: '20px', width: '70vw', height: '80vh', maxWidth: 'unset' } }}
      >
        <Grid container width="100%" height="100%" spacing={2}>
          <Grid item xs={9}>
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
              { markers.map((marker, index) => (
                <Marker
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  position={marker.leafletPosition}
                  draggable
                  eventHandlers={{
                    drag: (e) => {
                      const latLng = (e.target as LeafletMarker).getLatLng();
                      const newMarkers: typeof markers = [...markers];
                      newMarkers[index].leafletPosition = [latLng.lat, latLng.lng];
                      setMarkers(newMarkers);
                    },
                  }}
                >
                  <Popup>
                    { marker.gamePosition }
                  </Popup>
                </Marker>
              )) }
              {
                validCoordinates(testPointTransformed) && <Marker position={testPointTransformed} />
              }
            </MapContainer>
          </Grid>
          <Grid container item xs={3} spacing={2}>
            <Grid item xs={9}>
              <Button fullWidth component="label">
                Upload image
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleImageUpload(e.target.files?.[0] ?? null)}
                />
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button
                color="error"
                fullWidth
                disabled={image === null}
                onClick={() => setImage(null)}
              >
                <DeleteIcon stroke="black" strokeWidth="1px" />
              </Button>
            </Grid>
            <Grid item xs={6}>
              Test Point
            </Grid>
            <Grid item xs={6}>
              <CoordinateInput value={testPoint} onChange={(p) => setTestPoint(p)} />
            </Grid>
            { markers.map((m, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Grid item xs={4} key={i}>
                <CoordinateInput
                  value={m.gamePosition}
                  onChange={(p) => {
                    const newMarkers: typeof markers = [...markers];
                    newMarkers[i].gamePosition = p;
                    setMarkers(newMarkers);
                  }}
                />
              </Grid>
            )) }
          </Grid>
        </Grid>
        <Button onClick={handleSave}>Save</Button>
      </Dialog>
    </ThemeProvider>
  );
}

export default CustomMapDialog;
