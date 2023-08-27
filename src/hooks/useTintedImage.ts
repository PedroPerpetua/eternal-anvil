import { useEffect, useState } from 'react';

import { tintImage } from '../utils/images';

function useTintedImage(image: string, color: string) {
  const [resultingImage, setResultingImage] = useState(image);

  useEffect(() => {
    tintImage(image, color).then((imageUrl) => setResultingImage(imageUrl));
  }, [image, color]);

  return resultingImage;
}

export default useTintedImage;
