import { useEffect, useRef, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Button, Grid, Modal } from '@mui/material';
import ReactCrop, { PixelCrop } from 'react-image-crop';

import WarlordList from './WarlordList';
import useSortableContext from '../../../hooks/useSortableContext';
import { canvasPreview } from '../../../utils/canvas';
import { readFileAsURL } from '../../../utils/utilities';
import PasteArea from '../../common/paste-area/PasteArea';

type WarlordCropperProps = {
  onFinished: (croppedImages: string[]) => void,
};

function WarlordCropper({ onFinished }: WarlordCropperProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [image, setImage] = useState<string>('');
  const imageRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const {
    items: containers,
    addSortableItem: addImage,
    removeSortableItem: removeImage,
    clearSortableItems: clearImages,
    handlers,
    sensors,
  } = useSortableContext<'croppedContainer', string>(['croppedContainer']);
  const images = containers.get('croppedContainer') ?? [];
  const [currentCrop, setCurrentCrop] = useState<PixelCrop>();

  const handlePaste = (file: File) => {
    readFileAsURL(file).then((url) => setImage(url));
  };

  const handleCrop = () => {
    if (!previewCanvasRef.current) return;
    addImage('croppedContainer', previewCanvasRef.current.toDataURL());
    setCurrentCrop(undefined);
  };

  const handleClose = () => {
    setIsOpen(false);
    setImage('');
    clearImages();
  };

  const handleFinish = () => {
    onFinished(images.map((i) => i.value));
    handleClose();
  };

  useEffect(() => {
    if (!previewCanvasRef.current || !imageRef.current || !currentCrop) return;
    canvasPreview(imageRef.current, previewCanvasRef.current, currentCrop);
  }, [previewCanvasRef, imageRef, currentCrop]);

  return (
    <>
      <Modal
        id="warlord-cropper-modal"
        open={isOpen}
        onClose={handleClose}
      >
        <PasteArea variant="repeat" onPaste={handlePaste}>
          <div className="modal-container">
            {
            image === ''
              ? 'Paste an image'
              : (
                <Grid container height="100%" maxHeight="100%">
                  <Grid item xs={6} height="inherit" maxHeight="inherit">
                    <ReactCrop crop={currentCrop} onChange={(c) => setCurrentCrop(c)}>
                      <img ref={imageRef} src={image} alt="crop" />
                    </ReactCrop>
                  </Grid>
                  <Grid item xs={3} container direction="column" height="inherit" maxHeight="inherit">
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
                      <Button onClick={handleFinish}>Finish</Button>
                    </Grid>
                  </Grid>
                  <Grid item xs={3} height="inherit" maxHeight="inherit">
                    <DndContext
                      /* eslint-disable react/jsx-props-no-spreading */
                      {...handlers}
                      /* eslint-enable react/jsx-props-no-spreading */
                      sensors={sensors}
                    >
                      <WarlordList
                        images={[...images].reverse()}
                        removeImage={removeImage}
                      />

                    </DndContext>
                  </Grid>
                </Grid>
              )
          }
          </div>
        </PasteArea>
      </Modal>
      <Button onClick={() => setIsOpen(true)}>Add Warlord</Button>
    </>
  );
}

export default WarlordCropper;
