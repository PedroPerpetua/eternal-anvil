import moize from 'moize';
import { Matrix, applyToPoint, fromTriangles, inverse } from 'transformation-matrix';
/*
 * For the purpose of "empty numbers" (missing input) we use Infinity to make type checking more
 * fluid.
*/
export type Point = [number, number];

export const EMPTY_POINT: Point = [Infinity, Infinity];

/**
 * A collection of points. Note: may actually be more than three points; this is primarily used for
 * affine transformations, and the transform-matrix lib uses only the first three points of an
 * array.
 */
export type Triangle = [Point, Point, Point];

/**
 * Calculate the distance between two points, with an optional extra distance to be added to the
 * result.
 *
 * If the result is not a number, returns Infinity.
 * @param coord1 The first point.
 * @param coord2 The second point.
 * @param extraDistance Optional extra distance to add to the result.
 * @returns The distance between the two points.
 */
export function calcDistance(coord1: Point, coord2: Point, extraDistance = 0) {
  // Euclidean distance
  const dist = Math.sqrt((coord1[0] - coord2[0]) ** 2 + (coord1[1] - coord2[1]) ** 2);
  if (Number.isNaN(dist)) return Infinity;
  return dist + extraDistance;
}

/**
 * Calculates the time required to travel a certain distance over a certain speed (in seconds).
 * If the distance or speed are not finite, returns Infinity.
 * @param distance The distance to be traveled.
 * @param speed The speed in units / hour.
 * @returns The travel time it would take, in seconds.
 */
export function calcTravelTime(distance: number, speed: number) {
  if (!Number.isFinite(distance) || (!Number.isFinite(speed))) return Infinity;
  return (distance * 3600) / speed;
}
/**
 * Compute the Affine Transformation Matrix given a triangle with coordinates in both coordinate
 * systems.
 * @param fromSystem A triangle from the initial coordinate system.
 * @param toSystem The same triangle but in the new coordinate system.
 * @returns A Matrix that can be used to perform the affine transformation of points from the
 * `fromSystem` to the `toSystem`.
 */
export function computeAffineMatrix(fromSystem: Triangle, toSystem: Triangle) {
  return fromTriangles(fromSystem, toSystem);
}

// Moize expensive math functions for better performance
const memoizedApplyToPoint = moize(applyToPoint, { isShallowEqual: true });
const memoizedInverse = moize(inverse, { isShallowEqual: true });

/**
 * Transform a point from game coordinates to leaflet coordinates.
 * @param transformationMatrix The Affine Transformation Matrix of the transformation.
 * @param fromPoint The point in the game coordinates.
 * @returns The coordinates of the point in leaflet.
 */
export function gameToLeaflet(transformationMatrix: Matrix, fromPoint: Point) {
  return memoizedApplyToPoint(transformationMatrix, fromPoint) as Point;
}

/**
 * Transform a point from leaflet to game coordinates.
 * @param transformationMatrix The Affine Transformation Matrix of the transformation.
 * @param fromPoint The point in leaflet.
 * @returns The coordinates of the point in game coordinates.
 */
export function leafletToGame(transformationMatrix: Matrix, fromPoint: Point) {
  const point = memoizedApplyToPoint(memoizedInverse(transformationMatrix), fromPoint);
  return [Math.round(point[0]), Math.round(point[1])] as Point;
}

/**
 * Validate a set of coordinates to make sure they're a valid position.
 * @param coordinates The coordinates to test.
 * @returns True if the coordinates are valid.
 */
export function validCoordinates(coordinates: Point) {
  return Number.isFinite(coordinates[0]) && Number.isFinite(coordinates[1]);
}
