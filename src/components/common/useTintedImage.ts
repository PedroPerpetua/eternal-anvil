import { useEffect, useState } from 'react';
import { Image, Stack } from 'image-js';
import type { ImageKind } from 'image-js';

/**
 * Convert a hex color value into RGB values.
 * @param colorHex The hex value of the color to convert.
 * @returns Three values corresponding to red, green and blue.
 */
function hexToRGB(colorHex: string) {
  const convertRGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);
  if (!convertRGB) return [0, 0, 0] as [number, number, number];
  convertRGB.shift();
  return convertRGB.map((v) => parseInt(v, 16)) as [number, number, number];
}

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
  const [red, green, blue] = hexToRGB(color);
  const pixelCount = originalImage.width * originalImage.height;
  const pixelBitSize = 4; // RGBA;
  const colorArray = new Uint8Array(pixelCount * pixelBitSize);
  for (let i = 0; i < pixelCount; i += 1) {
    const offset = i * pixelBitSize;
    colorArray[offset] = red;
    colorArray[offset + 1] = green;
    colorArray[offset + 2] = blue;
    colorArray[offset + 3] = 255; // Alpha
  }
  const colorOverlay = new Image({
    width: originalImage.width,
    height: originalImage.height,
    kind: 'RGBA' as ImageKind,
    data: colorArray,
  });
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
