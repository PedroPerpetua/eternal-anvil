import { useEffect, useState } from 'react';

import { tintImage } from '../utils/images';

function useTintedImage(image: string, color?: string) {
  const [resultingImage, setResultingImage] = useState(image);

  useEffect(() => {
    if (color === undefined) setResultingImage(image);
    else tintImage(image, color).then((imageUrl) => setResultingImage(imageUrl));
  }, [image, color]);

  return resultingImage;
}

export default useTintedImage;
