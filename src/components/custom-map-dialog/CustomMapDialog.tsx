import {
  Button, Box, Modal, Grid,
} from '@mui/material';
import { useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import useCustomMapStore from '../../hooks/useCustomMapStore';
import CustomMapDisplay from './CustomMapDisplay';
import './CustomMapDialog.scss';
import { Point } from '../../types';
import CoordinateInput from '../coordinate-input/CoordinateInput';


function CustomMapDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    setImage, addMarker, imageInfo, reset,
  } = useCustomMapStore();

  const [testCoordinate, setTestCoordinate] = useState<Point>(
    [Infinity, Infinity],
  );

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImage(e.target.files?.[0]);
  };

  const handleSave = () => {};

  let content = null;
  if (imageInfo === null) {
    content = (
      <Button
        startIcon={<FileUploadIcon />}
        variant="contained"
        component="label"
      >
        Upload Image
        <input
          hidden
          accept="image/*"
          type="file"
          onChange={handleFile}
        />
      </Button>
    );
  } else {
    content = (
      <Grid container className="full-display" spacing={1}>
        <Grid item xs={9}>
          <CustomMapDisplay testPoint={testCoordinate} />
        </Grid>
        <Grid item xs={3}>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                component="label"
              >
                Change image
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFile}
                />
              </Button>

            </Grid>
            <Grid item xs={6}>
              <Button
                variant="contained"
                onClick={addMarker}
              >
                Add marker
              </Button>
            </Grid>
            <Grid item xs={12}>
              <CoordinateInput
                label="Test Coordinate"
                setValue={(p) => setTestCoordinate(p)}
                value={testCoordinate}
              />
            </Grid>
            <Grid item xs={12}>
              <Button onClick={handleSave}>Save</Button>
            </Grid>
            <Grid item xs={12}>
              <Button onClick={reset}>Clear custom map</Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }

  return (
    <>
      <Modal
        id="custom-map-dialog"
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Box className="container">
          { content }
        </Box>
      </Modal>

      <Button onClick={() => setIsOpen(true)}>
        Custom Map
      </Button>
    </>
  );
}

export default CustomMapDialog;
