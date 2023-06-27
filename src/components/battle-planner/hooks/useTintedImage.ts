import { useEffect, useState } from 'react';

import { tintImage } from '../../../utils/images';
import { HexColor } from '../../../utils/types';

function useTintedImage(image: string, color: HexColor) {
  const [resultingImage, setResultingImage] = useState(image);

  useEffect(() => {
    tintImage(image, color).then((imageUrl) => setResultingImage(imageUrl));
  }, [image, color]);

  return resultingImage;
}

export default useTintedImage;
