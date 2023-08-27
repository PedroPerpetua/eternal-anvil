import { Matrix, applyToPoint, fromTriangles } from 'transformation-matrix';
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
 * @param distance The distance to be traveled.
 * @param speed The speed in units / hour.
 * @returns The travel time it would take, in seconds.
 */
export function calcTravelTime(distance: number, speed: number) {
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

/**
 * Apply an Affine Transformation to a given point.
 * @param transformationMatrix The Affine Transformation Matrix that should be applied.
 * @param fromPoint The point in the original coordinates.
 * @returns The coordinates of the point in the destination coordinate system.
 */
export function transformPoint(transformationMatrix: Matrix, fromPoint: Point) {
  return applyToPoint(transformationMatrix, fromPoint) as Point;
}

/**
 * Validate a set of coordinates to make sure they're a valid position.
 * @param coordinates The coordinates to test.
 * @returns True if the coordinates are valid.
 */
export function validCoordinates(coordinates: Point) {
  return Number.isFinite(coordinates[0]) && Number.isFinite(coordinates[1]);
}
