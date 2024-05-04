import { useEffect, useState } from 'react';
import { Image, Stack } from 'image-js';

import { generateColoredImage } from './utils';

/**
 * Tint an image from a URL with the given color. This is achieved by stacking a solid image filled
 * with the wanted color on top and getting the min-image between both.
 * @param imageURL The url to the image to be tinted.
 * @param color The color to tint the image with, in hex.
 * @returns a DataURL for the tinted image.
 */
async function tintImage(imageURL: string, color: string) {
  const originalImage = await Image.load(imageURL);
  // Create an overlay that's just the solid color
  const colorOverlay = generateColoredImage(color, originalImage.width, originalImage.height);
  // Stack them and get the result
  const stack = new Stack([colorOverlay, originalImage]);
  return stack.getMinImage().toDataURL();
}

function useTintedImage(image: string, color?: string) {
  const [resultingImage, setResultingImage] = useState(image);

  useEffect(() => {
    if (color === undefined) setResultingImage(image);
    else tintImage(image, color).then((imageUrl) => setResultingImage(imageUrl));
  }, [image, color]);

  return resultingImage;
}

export default useTintedImage;
