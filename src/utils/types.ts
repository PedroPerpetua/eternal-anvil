/*
 * For the purpose of "empty numbers" (missing input) we use Infinity to make type checking more
 * fluid.
*/
export type Point = [number, number];

/**
 * A collection of points. Note: may actually be more than three points; this is primarily used for
 * affine transformations, and the transform-matrix lib uses only the first three points of an
 * array.
 */
export type Triangle = [Point, Point, Point];

/**
 * Represents the added distance penalty to missions.
 */
export type DistancePenalty = {
  shortName: string;
  description: string;
  penalty: number;
};

/**
 * Represents an enum of all the distance penalties.
 */
export type DistancePenaltyMap = {
  [key: string]: DistancePenalty;
};

/**
 * Hex color code for CSS purposes.
 */
export type HexColor = `#${string}`;
