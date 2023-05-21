import { useEffect, useRef, useState } from 'react';
import { Button, Grid } from '@mui/material';
import ReactCrop, { PixelCrop } from 'react-image-crop';

import WarlordCard from './WarlordCard';
import { canvasPreview } from '../../../utils/canvas';

type WarlordCropperProps = {
  image: string,
  onFinished: (croppedImages: string[]) => void,
};

function WarlordCropper({ image, onFinished }: WarlordCropperProps) {
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<string[]>([]);
  const [currentCrop, setCurrentCrop] = useState<PixelCrop>();

  console.log(currentCrop);

  const handleCrop = () => {
    if (!previewCanvasRef.current) return;
    setImages([...images, previewCanvasRef.current.toDataURL()]);
    setCurrentCrop(undefined);
  };

  useEffect(() => {
    if (!previewCanvasRef.current || !imageRef.current || !currentCrop) return;
    canvasPreview(imageRef.current, previewCanvasRef.current, currentCrop);
  }, [previewCanvasRef, imageRef, currentCrop]);

  return (
    <Grid container>

      <Grid item xs={6}>
        <ReactCrop crop={currentCrop} onChange={(c) => setCurrentCrop(c)}>
          <img ref={imageRef} src={image} alt="crop" />
        </ReactCrop>
      </Grid>

      <Grid item xs={3} container direction="column">
        <Grid item xs={9}>
          { currentCrop && (
            <canvas
              ref={previewCanvasRef}
              style={{
                border: '1px solid black',
                objectFit: 'contain',
                width: currentCrop.width,
                height: currentCrop.height,
              }}
            />
          ) }
        </Grid>
        <Grid item xs={1}>
          <Button onClick={handleCrop}>Crop</Button>
        </Grid>
        <Grid item xs={1}>
          <Button onClick={() => onFinished(images)}>Finish</Button>
        </Grid>
      </Grid>

      <Grid item xs={3}>
        {
          images.map((i, ind) => (
            <WarlordCard
              key={i}
              image={i}
              onDelete={() => { setImages(images.filter((_, index) => index !== ind)); }}
            />
          ))
        }
      </Grid>

    </Grid>
  );
}

export default WarlordCropper;
