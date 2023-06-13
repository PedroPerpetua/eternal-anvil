/* eslint-disable */
// @ts-nocheck
import moize from 'moize';
import { HexColor } from './types';
import { PixelCrop } from 'react-image-crop';
import Image, { ImageKind, Stack } from 'image-js';

/**
 * Convert a hex color value into RGB values.
 * @param colorHex The hex value of the color to convert.
 * @returns Three values corresponding to red, green and blue.
 */
export function hexToRGB(colorHex: HexColor) {
  const convertRGB = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(colorHex);
  if (!convertRGB) return [0, 0, 0] as [number, number, number];
  convertRGB.shift()
  return convertRGB.map((v) => parseInt(v, 16)) as [number, number, number];
}

/**
 * Tint an image from a URL with the given color. This is achieved by stacking a solid image filled
 * with the wanted color on top and getting the min-image between both.
 * @param imageURL The url to the image to be tinted.
 * @param color The color to tint the image with, in hex.
 * @returns a DataURL for the tinted image.
 */
export async function tintImage(imageURL: string, color: HexColor) {
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
    data: colorArray
  });
  // Stack them and get the result
  const stack = new Stack([colorOverlay, originalImage]);
  return stack.getMinImage().toDataURL();
}

/* https://stackoverflow.com/a/13532993/13525157 ------------------------------------------------ */
/**
 * Shade a hex color by a percentage.
 * @param color The hex value of the color to be shaded.
 * @param percent The percentage to shade the color into. Higher percentage means darker.
 * @returns The resulting hex color.
 */
function _shadeColor(color: HexColor, percent: number) {
  let [red, green, blue] = hexToRGB(color);
  red = parseInt(red * (100 + percent) / 100);
  green = parseInt(green * (100 + percent) / 100);
  blue = parseInt(blue * (100 + percent) / 100);

  red = (red<255)?red:255;
  green = (green<255)?green:255;
  blue = (blue<255)?blue:255;

  red = Math.round(red)
  green = Math.round(green)
  blue = Math.round(blue)

  const redString = ((red.toString(16).length==1)?"0"+red.toString(16):red.toString(16));
  const greenString = ((green.toString(16).length==1)?"0"+green.toString(16):green.toString(16));
  const blueString = ((blue.toString(16).length==1)?"0"+blue.toString(16):blue.toString(16));

  return `#${redString}${greenString}${blueString}`;
}

export const shadeColor = moize(_shadeColor);

/* https://github.com/GirkovArpa/hex-color-mixer ------------------------------------------------ */
function hex2dec(hex) {
  return hex.replace('#', '').match(/.{2}/g).map(n => parseInt(n, 16));
}

function rgb2hex(r, g, b) {
  r = Math.round(r);
  g = Math.round(g);
  b = Math.round(b);
  r = Math.min(r, 255);
  g = Math.min(g, 255);
  b = Math.min(b, 255);
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function rgb2cmyk(r, g, b) {
  let c = 1 - (r / 255);
  let m = 1 - (g / 255);
  let y = 1 - (b / 255);
  let k = Math.min(c, m, y);
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  return [c, m, y, k];
}

function cmyk2rgb(c, m, y, k) {
  let r = c * (1 - k) + k;
  let g = m * (1 - k) + k;
  let b = y * (1 - k) + k;
  r = (1 - r) * 255 + .5;
  g = (1 - g) * 255 + .5;
  b = (1 - b) * 255 + .5;
  return [r, g, b];
}


function mix_cmyks(...cmyks) {
  let c = cmyks.map(cmyk => cmyk[0]).reduce((a, b) => a + b, 0) / cmyks.length;
  let m = cmyks.map(cmyk => cmyk[1]).reduce((a, b) => a + b, 0) / cmyks.length;
  let y = cmyks.map(cmyk => cmyk[2]).reduce((a, b) => a + b, 0) / cmyks.length;
  let k = cmyks.map(cmyk => cmyk[3]).reduce((a, b) => a + b, 0) / cmyks.length;
  return [c, m, y, k];
}

/**
 * Blend multiple hex colors together.
 * @param hexes The hex color codes to blend.
 * @returns A hex color resulting of the blend of all the provided colors.
 */
function mix_hexes(...hexes: HexColor[]) {
  let rgbs = hexes.map(hex => hex2dec(hex));
  let cmyks = rgbs.map(rgb => rgb2cmyk(...rgb));
  let mixture_cmyk = mix_cmyks(...cmyks);
  let mixture_rgb = cmyk2rgb(...mixture_cmyk);
  let mixture_hex = rgb2hex(...mixture_rgb);
  return mixture_hex as HexColor;
}

export const blendColors = moize(mix_hexes)


/* https://codesandbox.io/s/react-image-crop-demo-with-react-hooks-y831o ------------------------ */

/**
 * Render a preview of the crop of a canvas into an image element.
 * @param image A reference to an HTMLImageElement to display the preview in.
 * @param canvas A reference to an HTMLCanvasElement from where to take the preview.
 * @param crop A PixelCrop detailing the area to preview.
 */
export function canvasPreview(
  image: HTMLImageElement,
  canvas: HTMLCanvasElement,
  crop: PixelCrop,
) {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No 2d context');
  }

  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  // devicePixelRatio slightly increases sharpness on retina devices
  // at the expense of slightly slower render times and needing to
  // size the image back down if you want to download/upload and be
  // true to the images natural size.
  const pixelRatio = window.devicePixelRatio;
  // const pixelRatio = 1

  canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
  canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

  ctx.scale(pixelRatio, pixelRatio);
  ctx.imageSmoothingQuality = 'high';

  const cropX = crop.x * scaleX;
  const cropY = crop.y * scaleY;

  ctx.save();
  // Move the crop origin to the canvas origin (0,0)
  ctx.translate(-cropX, -cropY);
  // Draw it
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
  );
  ctx.restore();
}
