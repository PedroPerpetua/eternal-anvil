import { Icon as LeafletIcon } from 'leaflet';

import { INFINITE_CHAR } from './constants';
import { Colors } from './types';

export function generateId() {
  return crypto.randomUUID();
}

/**
 * Format a time in seconds into a more human readable string.
 * @param seconds The time in seconds to format.
 * @returns A string formatted as `HH:MM:SS` (or `INFINITE_CHAR`).
 */
export function formatSeconds(seconds: number) {
  if (!Number.isFinite(seconds)) return INFINITE_CHAR;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const finalSeconds = Math.floor((seconds % 3600) % 60);

  function pad(num: number, size: number) {
    let numStr = num.toString();
    while (numStr.length < size) numStr = `0${numStr}`;
    return numStr;
  }

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(finalSeconds, 2)}`;
}

/**
 * Asynchronous wrapper around a FileReader's readAsDataURL method.
 * @param file File to read.
 * @returns The loaded DataURL.
 */
export function readFileAsURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (typeof fr.result !== 'string') {
        reject(new Error(`Reader returned '${fr.result}' (type '${typeof fr.result}'.`));
        return;
      }
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/**
 * Asynchronous wrapper around loading an image with the Image class.
 * @param url The URL to read from.
 * @returns The resulting Image object.
 */
export function readImageFromURL(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

export function coloredMarker(color: Colors, large = false) {
  const query = `marker-icon${large ? '-2x' : ''}-${color.valueOf()}.png`;
  return new LeafletIcon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/${query}`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
}
