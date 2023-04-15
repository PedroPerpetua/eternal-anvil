/*
For the purpose of "empty numbers" (missing input) we use Infinity to
make type checking more fluid
*/
export type Point = [number, number];

export type DistancePenalty = {
  shortName: string;
  description: string;
  penalty: number;
};

export type DistancePenaltyMap = {
  [key: string]: DistancePenalty;
};
