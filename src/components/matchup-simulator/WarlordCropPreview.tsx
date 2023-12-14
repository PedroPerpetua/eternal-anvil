import { useEffect, useState } from 'react';
import { Area } from 'react-easy-crop';

import { cropImage } from '../../utils/images';

type WarlordCropPreviewProps = ({
  original: string,
  cropArea: Area,
  cuts: number[],
  cutIndex: number,
});

function WarlordCropPreview({ original, cropArea, cuts, cutIndex }: WarlordCropPreviewProps) {
  const [image, setImage] = useState<string>(original);

  useEffect(() => {
    const abortController = new AbortController();
    const effect = async () => {
      const cutWidth = cropArea.width;
      const cutHeight = cropArea.height;
      const ratio = cutWidth / cuts.reduce((v, curr) => curr + v, 0);
      const xOffset = cuts.slice(0, cutIndex).reduce((v, curr) => curr + v, 0) * ratio;
      const res = await cropImage(original, {
        // DIVIDER SIZE NEEDS TO BE ADJUSTED TO ASPECT RATIO
        x: cropArea.x + xOffset,
        y: cropArea.y,
        width: cuts[cutIndex] * ratio,
        height: cutHeight,
      });
      if (!abortController.signal.aborted) setImage(res ?? '');
    };
    effect();
    return () => abortController.abort();
  }, [
    original,
    cropArea.width,
    cropArea.height,
    cropArea.x,
    cropArea.y,
    cuts,
    cutIndex,
  ]);

  return (<img src={image} alt="cropped-result" />);
}

export default WarlordCropPreview;
