import { useEffect, useRef, useState } from 'react';
import {
  Box, Button, Chip, Divider, Grid, MenuItem, Modal, Stack, TextField, Tooltip, Typography,
} from '@mui/material';
import Cropper, { Area } from 'react-easy-crop';
import { shallowEqual } from 'react-redux';

import WarlordGridTowerx1 from '../../assets/warlord-grid-tower-x1.png';
import WarlordGridTowerx2 from '../../assets/warlord-grid-tower-x2.png';
import WarlordGridWalkingx1 from '../../assets/warlord-grid-walking-x1.png';
import WarlordGridWalkingx2 from '../../assets/warlord-grid-walking-x2.png';
import WarlordGridWalkingx3 from '../../assets/warlord-grid-walking-x3.png';
import { useAppDispatch } from '../../store';
import { useMatchupSimulatorSelector } from '../../store/matchup-simulator';
import { CropConfig, cutCropper, openCropper, setCropperImage } from '../../store/matchup-simulator/warlordsSlice';
import { cropImage } from '../../utils/images';
import { readFileAsURL } from '../../utils/utilities';
import DeleteIcon from '../common/styled-components/DeleteIcon';

type CropConfigData = {
  image: string,
  ratio: number,
  cuts: number[],
};

const CropConfigs: Record<CropConfig, CropConfigData> = {
  TOWER_x1: {
    image: WarlordGridTowerx1,
    ratio: 310 / 116,
    cuts: [310],
  },
  TOWER_x2: {
    image: WarlordGridTowerx2,
    ratio: 626 / 116,
    cuts: [310, 6, 310],
  },
  WALKING_x1: {
    image: WarlordGridWalkingx1,
    ratio: 310 / 128,
    cuts: [310],
  },
  WALKING_x2: {
    image: WarlordGridWalkingx2,
    ratio: 622 / 128,
    cuts: [310, 2, 310],
  },
  WALKING_x3: {
    image: WarlordGridWalkingx3,
    ratio: 932 / 128,
    cuts: [309, 2, 309, 2, 309],
  },
};

async function cutImage(originalImage: string, cropArea: Area, cuts: number[]) {
  const ratio = cropArea.width / cuts.reduce((v, curr) => v + curr, 0);
  return Promise.all(cuts.map(async (cut, cutIndex) => {
    const xOffset = cuts.slice(0, cutIndex).reduce((v, curr) => curr + v, 0);
    return await cropImage(originalImage, {
      x: cropArea.x + xOffset,
      y: cropArea.y,
      width: cut * ratio,
      height: cropArea.height,
    }) ?? '';
  }));
}

function WarlordCropper() {
  const dispatch = useAppDispatch();
  const openFor = useMatchupSimulatorSelector((state) => state.cropper.openFor);
  const image = useMatchupSimulatorSelector((state) => state.cropper.currentImage);
  const croppedImages = useMatchupSimulatorSelector(
    (state) => state.cropper.croppedWls,
    shallowEqual,
  );
  const [cropArea, setCropArea] = useState<Area | null>(null);
  // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
  const [_cropConfig, setCropConfig] = useState<CropConfig>('TOWER_x2');
  // eslint-disable-next-line no-underscore-dangle
  const cropConfig = CropConfigs[_cropConfig];
  // Cropper controls
  const [crop, setCrop] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1.125);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  useEffect(() => {
    if (image === null || cropArea === null) setPreviewImages([]);
    else {
      cutImage(image, cropArea, cropConfig.cuts)
        // Only the even pictures (odd are dividers)
        .then((images) => setPreviewImages(images.filter((_, i) => i % 2 === 0)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [image, JSON.stringify(cropArea), JSON.stringify(cropConfig.cuts)]);

  console.log(previewImages);

  // When the image changes, scroll to the top
  const listTopRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (listTopRef.current) listTopRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [listTopRef, image]);

  // When an image is added, scroll to the bottom
  const listBottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (listBottomRef.current) listBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [listBottomRef, croppedImages]);

  const handleImageUpload = (file?: File) => {
    if (!file) return;
    readFileAsURL(file).then((res) => dispatch(setCropperImage(res)));
  };

  return (
    <Modal open={openFor !== null} onClose={() => dispatch(openCropper(null))}>
      <Box
        sx={{
          width: '80vw',
          height: '80vh',
          backgroundColor: 'white',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '5px',
          padding: '20px',
        }}
        onPaste={(e) => handleImageUpload(e.clipboardData.files[0])}
      >
        <Grid container height="100%" spacing={1}>
          <Grid item xs={9}>
            <Box // https://github.com/ValentinH/react-easy-crop/issues/502
              sx={{
                padding: '100px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'stretch',
                justifyContent: 'stretch',
                width: '100%',
                height: '100%',
              }}
            >
              <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                {
                image && (
                  <Cropper
                    image={image}
                    crop={crop}
                    onCropChange={setCrop}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    minZoom={0.8}
                    maxZoom={3}
                    zoomSpeed={0.05}
                    restrictPosition={false}
                    showGrid={false}
                    aspect={cropConfig.ratio}
                    style={{
                      cropAreaStyle: {
                        backgroundImage: `url(${cropConfig.image})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                      },
                    }}
                    onCropComplete={(_, croppedArea) => setCropArea(croppedArea)}
                  />
                )
              }
              </Box>
            </Box>
          </Grid>
          <Grid item xs={3} height="100%">
            <Stack height="100%" spacing={1}>
              <Stack direction="row" spacing={1}>
                <Button variant="contained" component="label" fullWidth>
                  Upload image
                  <input
                    hidden
                    accept="image/*"
                    type="file"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                  />
                </Button>
                <Tooltip title={image !== null ? 'Clear Image' : ''}>
                  <span>
                    <Button
                      variant="contained"
                      color="error"
                      disabled={image === null}
                      onClick={() => dispatch(setCropperImage(null))}
                    >
                      <DeleteIcon />
                    </Button>
                  </span>
                </Tooltip>
              </Stack>
              <Typography variant="subtitle1" fontSize={12} textAlign="center">
                (You can also paste an image)
              </Typography>
              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => dispatch(cutCropper(previewImages))}
                  disabled={previewImages.length === 0}
                >
                  Crop
                </Button>
                <TextField
                  fullWidth
                  onChange={(e) => setCropConfig(e.target.value as CropConfig)}
                  disabled={previewImages.length === 0}
                  label="Mode"
                  select
                >
                  {
                    Object.keys(CropConfigs).map((label) => (
                      <MenuItem key={label} value={label}>
                        { label }
                      </MenuItem>
                    ))
                  }
                </TextField>
              </Stack>
              <Stack
                spacing={1}
                sx={{
                  overflowY: 'scroll',
                  paddingRight: '1px',
                  marginRight: '-10px',
                  flex: 1,
                  scrollBehavior: 'smooth',
                  '&::-webkit-scrollbar': {
                    width: '10px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#d8bc68',
                    border: '2px solid transparent',
                    backgroundClip: 'content-box',
                    borderRadius: '5px',
                  },
                }}
              >
                <Box sx={{ display: 'hidden' }} ref={listTopRef} />
                {
                  previewImages.length !== 0 && (
                    <>
                      <Divider>
                        <Chip label="Preview" />
                      </Divider>
                      {
                        previewImages.map((img, i) => (
                          <img key={`wl_prev_${img}`} src={img} alt={`wl_prev_${i}`} />
                        ))
                      }
                    </>
                  )
                }
                <Divider>
                  <Chip label="Added" />
                </Divider>
                {
                  croppedImages.map((img, i) => (
                    <img key={`wl_${img}`} src={img} alt={`wl_${i}`} />
                  ))
                }
                <Box sx={{ display: 'hidden' }} ref={listBottomRef} />
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

export default WarlordCropper;
