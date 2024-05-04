import { Image } from 'image-js';
import type { ImageKind } from 'image-js';
/**
 * Convert a hex color value into RGB values.
 * @param colorHex The hex value of the color to convert.
 * @returns Three values corresponding to red, green and blue.
 */
export function hexToRGB(colorHex: string) {
  const convertRGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);
  if (!convertRGB) return [0, 0, 0] as [number, number, number];
  convertRGB.shift();
  return convertRGB.map((v) => parseInt(v, 16)) as [number, number, number];
}

export function generateColoredImage(color: string, width: number, height: number) {
  const [red, green, blue] = hexToRGB(color);
  const pixelCount = width * height;
  const pixelBitSize = 4; // RGBA;
  const colorArray = new Uint8Array(pixelCount * pixelBitSize);
  for (let i = 0; i < pixelCount; i += 1) {
    const offset = i * pixelBitSize;
    colorArray[offset] = red;
    colorArray[offset + 1] = green;
    colorArray[offset + 2] = blue;
    colorArray[offset + 3] = 255; // Alpha
  }
  return new Image({
    width,
    height,
    kind: 'RGBA' as ImageKind,
    data: colorArray,
  });
}
