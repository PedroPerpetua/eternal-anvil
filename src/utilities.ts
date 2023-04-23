import { INFINITE_CHAR } from './constants';
import { Point } from './types';

/**
 * Validates that a point is a valid coordinate.
 * @param point The point to validate.
 * @returns True if the point is valid.
 */
export function validatePoint(point: Point): point is [number, number] {
  return (Number.isInteger(point[0]) && Number.isInteger(point[1]));
}

/**
 * Validates that some text can be used as part of a coordinate. This will
 * validate that the number is an integer and that it's clamped between
 * -999 and 999.
 * @param text The text to validate.
 * @returns True if the text is a valid coordinate cell.
 */
export function validateCoordinateText(text: string) {
  const number = Number(text);
  if (!Number.isInteger(number)) return false;
  if (number < -999 || number > 999) return false;
  return true;
}

/**
 * Calculate the distance between two points, with an optional extra distance
 * to be added to the result.
 *
 * If any coordinate is invalid, returns `Infinity`.
 * @param coord1 The first point.
 * @param coord2 The second point.
 * @param extraDistance Optional extra distance to add to the result.
 * @returns The distance between the two points.
 */
// Clashes with maxLen
/* eslint-disable function-paren-newline */
export function calculateDistance(
  coord1: Point, coord2: Point, extraDistance = 0,
) {
/* eslint-enable function-paren-newline */
  // Euclidean distance
  const distance = Math.sqrt(
    (coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2,
  );
  if (Number.isNaN(distance)) return Infinity;
  return distance + extraDistance;
}

/**
 * Calculates the time required to travel a certain distance over a certain
 * speed (in seconds)
 *
 * If either `distance` or `speed` are infinite, returns `Infinity`
 * @param distance The distance to be traveled.
 * @param speed The speed in units / hour.
 * @returns The travel time it would take.
 */
export function calculateTravelTime(distance: number, speed: number) {
  if (!Number.isFinite(speed) || !Number.isFinite(distance)) return Infinity;
  return (distance * 3600) / speed;
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
        reject(new Error(
          `Reader returned '${fr.result}' (type '${typeof fr.result}'.`,
        ));
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
