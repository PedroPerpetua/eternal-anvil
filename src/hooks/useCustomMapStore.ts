import { useCallback } from 'react';
import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import { EMPTY_POINT } from '../utils/constants';
import { computeAffineMatrix } from '../utils/math';
import { Point, Triangle } from '../utils/types';
import { generateId, readFileAsURL, readImageFromURL } from '../utils/utilities';

export type CustomImageMapInfo = {
  url: string,
  width: number,
  height: number,
  center: Point,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const customMapStore_imageInfo = atom<CustomImageMapInfo | null>({
  key: 'customMapStore_imageInfo',
  default: null,
});

/**
 * Type for markers placed by the user to map out the image. `displayCoordinates` represent the
 * coordinates in the Leaflet map; `intendedCoordinates` represent the "in game" coordinates - the
 * coordinates that the point should map to.
 */
export type ReferenceMarker = {
  readonly id: string,
  displayCoordinates: Point,
  intendedCoordinates: Point
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const customMapStore_referenceMarkers = atom<Map<string, ReferenceMarker>>({
  key: 'customMapStore_referenceMarkers',
  default: new Map<string, ReferenceMarker>(),
});

/**
 * Store to handle everything related to using a custom map for the battle-planner.
 *
 * This store handles the transformation of coordinates from the game to the used image.
 *
 * `intended` coordinates, points, etc refer to the "real" coordinates of objects inside Arkheim.
 *
 * `display` coordinates, points, etc refer to the coordinates in the Leaflet grid when displaying
 * the map.
 * @returns Functions and constants that allow interacting with the global state.
 */
function useCustomMapStore() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [customImageMapInfo, _setCustomImageMapInfo] = useRecoilState(customMapStore_imageInfo);
  const resetImageInfo = useResetRecoilState(customMapStore_imageInfo);
  const [referenceMarkers, setReferenceMarkers] = useRecoilState(customMapStore_referenceMarkers);
  const resetMarkers = useResetRecoilState(customMapStore_referenceMarkers);

  /* Handle customImageMapInfo ----------------------------------------------------------------- */

  /**
   * Set the current image to an uploaded image.
   * @param file The uploaded image to extract information from.
   * @returns An object with all the information needed from the image.
   */
  const setCustomImageMapInfo = async (file?: File) => {
    resetMarkers();
    if (!file) return;
    const url = await readFileAsURL(file);
    const { width, height } = await readImageFromURL(url);
    _setCustomImageMapInfo({
      url, width, height, center: [height / 2, width / 2],
    });
  };

  /* Handle referenceMarkers ------------------------------------------------------------------- */

  /**
   * Auxiliary constant to check if we have the required number of markers placed or not.
   */
  const allMarkersPlaced = referenceMarkers.size >= 3;

  /**
   * Create a new referenceMarker in the center of the display.
   * @returns The id of the created marker, or null if none were created.
   */
  const createReferenceMarker = () => {
    if (customImageMapInfo === null) return null;
    if (allMarkersPlaced) return null;
    const id = generateId();
    const marker: ReferenceMarker = {
      id,
      displayCoordinates: customImageMapInfo.center,
      intendedCoordinates: EMPTY_POINT,
    };
    // Modify state
    const newReferenceMarkers = new Map(referenceMarkers);
    newReferenceMarkers.set(id, marker);
    setReferenceMarkers(newReferenceMarkers);
    return id;
  };

  /**
   * Modify an existing marker, by id.
   * @param id The marker's id.
   * @param newData Partial ReferenceMarker data to override in the original marker.
   */
  const modifyReferenceMarker = (id: string, newData: Partial<ReferenceMarker>) => {
    const marker = referenceMarkers.get(id);
    if (marker === undefined) return;
    // Modify state
    const newReferenceMarkers = new Map(referenceMarkers);
    newReferenceMarkers.set(id, { ...marker, ...newData });
    setReferenceMarkers(newReferenceMarkers);
  };

  /**
   * Delete a marker, by id.
   * @param id The marker's id.
   */
  const deleteReferenceMarker = (id: string) => {
    // Modify state
    const newReferenceMarkers = new Map(referenceMarkers);
    newReferenceMarkers.delete(id);
    setReferenceMarkers(newReferenceMarkers);
  };

  /* Auxiliary --------------------------------------------------------------------------------- */

  /**
   * Reset the entire store state to it's defaults.
   */
  const reset = () => {
    resetImageInfo();
    resetMarkers();
  };

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  const _computeTransformationMatrix = () => {
    if (!allMarkersPlaced) return null;
    const [intendedTriangle, displayTriangle] = [...referenceMarkers.values()].reduce(
      ([intendedTriangleArray, displayTriangleArray], currentMarker) => {
        intendedTriangleArray.push(currentMarker.intendedCoordinates);
        displayTriangleArray.push(currentMarker.displayCoordinates);
        return [intendedTriangleArray, displayTriangleArray];
      },
      [new Array<Point>(), new Array<Point>()],
    );
    try {
      return computeAffineMatrix(intendedTriangle as Triangle, displayTriangle as Triangle);
    } catch {
      return null;
    }
  };

  /**
   * Calculate the transformation matrix from intended coordinated to display coordinates.
   * @returns The transformation matrix from intended to display, or null if there's not enough
   * coordinates to compute it.
   */
  const computeTransformationMatrix = useCallback(
    _computeTransformationMatrix,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useDeepCompareMemoize([referenceMarkers]),
  );

  return {
    // customImageMapInfo
    customImageMapInfo,
    setCustomImageMapInfo,
    // referenceMarkers
    referenceMarkers,
    allMarkersPlaced,
    createReferenceMarker,
    modifyReferenceMarker,
    deleteReferenceMarker,
    // Auxiliary
    reset,
    computeTransformationMatrix,
  };
}

export default useCustomMapStore;
