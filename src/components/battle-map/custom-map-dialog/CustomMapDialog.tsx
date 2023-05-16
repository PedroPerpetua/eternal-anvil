import { useState } from 'react';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import {
  Button, Box, Modal, Grid,
} from '@mui/material';

import CustomMapDisplay from './CustomMapDisplay';
import useBattleMapStore from '../../../hooks/useBattleMapStore';
import useCustomMapStore from '../../../hooks/useCustomMapStore';
import { EMPTY_POINT } from '../../../utils/constants';
import { Point } from '../../../utils/types';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';

import './CustomMapDialog.scss';

function CustomMapDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    customImageMapInfo,
    setCustomImageMapInfo,
    createReferenceMarker,
    reset,
    computeTransformationMatrix,
  } = useCustomMapStore();

  const { setMapInfo } = useBattleMapStore();

  const [testCoordinate, setTestCoordinate] = useState<Point>(EMPTY_POINT);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomImageMapInfo(e.target.files?.[0]);
  };

  const handleSave = () => {
    if (customImageMapInfo === null) return;
    const matrix = computeTransformationMatrix();
    if (matrix === null) return;
    setMapInfo({ imageMapInfo: customImageMapInfo, transformationMatrix: matrix });
    setIsOpen(false);
  };

  let content = null;
  if (customImageMapInfo === null) {
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
                onClick={createReferenceMarker}
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
