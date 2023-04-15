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
  if (!validatePoint(coord1) || !validatePoint(coord2)) return Infinity;
  // Euclidean distance
  const distance = Math.sqrt(
    (coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2,
  );
  return distance + extraDistance;
}

/**
 * Calculates the time required to travel a certain distance over a certain
 * speed.
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
