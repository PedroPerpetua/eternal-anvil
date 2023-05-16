import { useCallback } from 'react';
import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';

import useRecoilDB from './useRecoilDB';
import { EMPTY_POINT } from '../utils/constants';
import { computeAffineMatrix } from '../utils/math';
import { Id, Point, Triangle } from '../utils/types';
import { readFileAsURL, readImageFromURL } from '../utils/utilities';

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
  readonly id: Id,
  displayCoordinates: Point,
  intendedCoordinates: Point
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const customMapStore_referenceMarkers = atom({
  key: 'customMapStore_referenceMarkers',
  default: new Map<Id, ReferenceMarker>(),
});

/**
 * Store to handle everything related to using a custom map for the battle-planner.
 * @returns Functions and constants that allow interacting with the store.
 */
function useCustomMapStore() {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const [customImageMapInfo, _setCustomImageMapInfo] = useRecoilState(customMapStore_imageInfo);
  const resetImageInfo = useResetRecoilState(customMapStore_imageInfo);
  const referenceMarkersDB = useRecoilDB(customMapStore_referenceMarkers);

  /* Handle customImageMapInfo ----------------------------------------------------------------- */

  /**
   * Set the current image to an uploaded image.
   * @param file The uploaded image to extract information from.
   * @returns An object with all the information needed from the image.
   */
  const setCustomImageMapInfo = async (file?: File) => {
    referenceMarkersDB.resetDB();
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
  const allMarkersPlaced = referenceMarkersDB.count() >= 3;

  /**
   * Retrieve a single referenceMarker, by id.
   * @param id The referenceMarker's id.
   * @returns The referenceMarker's object from the store.
   */
  const getReferenceMarker = (id: Id) => referenceMarkersDB.getItem(id);

  /**
   * Create a new referenceMarker in the center of the display.
   */
  const createReferenceMarker = () => {
    if (customImageMapInfo === null) return;
    referenceMarkersDB.createItem(
      { displayCoordinates: customImageMapInfo.center, intendedCoordinates: EMPTY_POINT },
    );
  };

  /**
   * Modify an existing referenceMarker, by id.
   * @param id The marker's id.
   * @param newData Partial ReferenceMarker data to override in the original marker.
   */
  const modifyReferenceMarker = (id: Id, newData: Partial<ReferenceMarker>) => {
    referenceMarkersDB.modifyItem(id, newData);
  };

  /**
   * Delete a referenceMarker, by id.
   * @param id The marker's id.
   */
  const deleteReferenceMarker = (id: Id) => {
    referenceMarkersDB.deleteItem(id);
  };

  /* Auxiliary --------------------------------------------------------------------------------- */

  /**
   * Reset the entire store state to it's defaults.
   */
  const reset = () => {
    resetImageInfo();
    referenceMarkersDB.resetDB();
  };

  /**
   * Inner function to be memoized.
   * @returns The calculated affine matrix.
   */
  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  const _computeTransformationMatrix = () => {
    if (!allMarkersPlaced) return null;
    const [intendedTriangle, displayTriangle] = referenceMarkersDB.asArray().reduce(
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
    useDeepCompareMemoize([referenceMarkersDB.items]),
  );

  return {
    // customImageMapInfo
    customImageMapInfo,
    setCustomImageMapInfo,
    // referenceMarkers
    referenceMarkers: referenceMarkersDB.asArray(),
    allMarkersPlaced,
    getReferenceMarker,
    createReferenceMarker,
    modifyReferenceMarker,
    deleteReferenceMarker,
    // Auxiliary
    reset,
    computeTransformationMatrix,
  };
}

export default useCustomMapStore;
