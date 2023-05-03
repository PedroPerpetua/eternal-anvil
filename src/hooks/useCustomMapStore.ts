import { atom, useRecoilState, useResetRecoilState } from 'recoil';

import { EMPTY_POINT } from '../utils/constants';
import { computeAffineMatrix, transformPoint } from '../utils/math';
import { Point, Triangle } from '../utils/types';
import { readFileAsURL, readImageFromURL } from '../utils/utilities';

export type ImageMapInfo = {
  url: string,
  width: number,
  height: number
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const customMapStore_imageInfo = atom<ImageMapInfo | null>({
  key: 'customMapStore_imageInfo',
  default: null,
});

export type InputMarker = {
  displayCoordinates: Point,
  intendedCoordinates: Point
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const customMapStore_markers = atom<Map<string, InputMarker>>({
  key: 'customMapStore_markers',
  default: new Map<string, InputMarker>(),
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
 * @returns Functions and constants that allow interacting with the global
 * state.
 */
function useCustomMapStore() {
  const [imageInfo, setImageInfo] = useRecoilState(customMapStore_imageInfo);
  const imageInfoReset = useResetRecoilState(customMapStore_imageInfo);
  const [markers, setMarkers] = useRecoilState(customMapStore_markers);
  const markersReset = useResetRecoilState(customMapStore_markers);

  /**
   * Reset the entire store state to it's defaults.
   */
  const reset = () => {
    imageInfoReset();
    markersReset();
  };

  /* Handle coordinates ------------------------------------------------------------------------- */

  /**
   * Center of the current selected map; `EMPTY_POINT` if there's no custom map.
   * custom map.
   */
  const center: Point = imageInfo ? [imageInfo.height / 2, imageInfo.width / 2] : EMPTY_POINT;

  /**
   * Compute the resulting transformation matrix to be applied to points.
   */
  const markersArray = [...markers.values()];
  const transformationMatrix = markersArray.length < 3
    ? null
    : computeAffineMatrix(
      markersArray.map((p) => p.intendedCoordinates) as Triangle,
      markersArray.map((p) => p.displayCoordinates) as Triangle,
    );

  /**
   * Translate a point from the intended coordinate system to the display coordinate system.
   * @param point The point's coordinates in the intended coordinate system.
   * @returns The point's coordinates in the display coordinate system.
   */
  const intendedToDisplay = (point: Point) => {
    if (transformationMatrix === null) return EMPTY_POINT;
    return transformPoint(transformationMatrix, point);
  };

  /* Handle imageInfo --------------------------------------------------------------------------- */

  /**
   * Set the current map to the custom image. This will clear the current map
   * and all markers on it.
   * @param file The file to set the image to.
   */
  const setImage = async (file?: File) => {
    markersReset();
    if (!file) return;
    const url = await readFileAsURL(file);
    const { width, height } = await readImageFromURL(url);
    setImageInfo({ url, width, height });
  };

  /* Handle markers ----------------------------------------------------------------------------- */

  /**
   * Add a marker to the current custom map. The marker will initially be set
   * to the center of the map and have a randomly generated id.
   */
  const addMarker = () => {
    if (!imageInfo) return;
    // Add it to the center of the map
    const newId = crypto.randomUUID();
    const newMarkers = new Map(markers);
    newMarkers.set(
      newId,
      {
        displayCoordinates: center,
        intendedCoordinates: [Infinity, Infinity],
      },
    );
    setMarkers(newMarkers);
  };

  /**
   * Getter method to get the exact marker from the store, by id.
   * @param id The id of the marker we want.
   * @returns The marker with the given id.
   */
  const getMarker = (id: string) => markers.get(id);

  /**
   * Set a marker's display position (position in the Leaflet map).
   * @param id The marker's id.
   * @param position The new position.
   */
  const setMarkerDisplayPosition = (id: string, position: Point) => {
    const originalMarker = markers.get(id);
    if (!originalMarker) return;
    const newMarkers = new Map(markers);
    newMarkers.set(id, { ...originalMarker, displayCoordinates: position });
    setMarkers(newMarkers);
  };

  /**
   * Set a marker's intended position (position in game).
   * @param id The marker's id.
   * @param position The new position.
   */
  const setMarkerIntendedPosition = (id: string, position: Point) => {
    const originalMarker = markers.get(id);
    if (!originalMarker) return;
    const newMarkers = new Map(markers);
    newMarkers.set(id, { ...originalMarker, intendedCoordinates: position });
    setMarkers(newMarkers);
  };

  /**
   * Remove an existing marker.
   * @param id The marker's id.
   */
  const removeMarker = (id: string) => {
    const newMarkers = new Map(markers);
    newMarkers.delete(id);
    setMarkers(newMarkers);
  };

  return {
    reset,
    // coordinates
    center,
    transformationMatrix,
    intendedToDisplay,
    // imageInfo
    imageInfo,
    setImage,
    // markers
    markers,
    addMarker,
    getMarker,
    setMarkerDisplayPosition,
    setMarkerIntendedPosition,
    removeMarker,
  };
}

export default useCustomMapStore;
