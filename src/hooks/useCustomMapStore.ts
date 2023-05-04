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
 * @returns Functions and constants that allow interacting with the global state.
 */
function useCustomMapStore() {
  const [imageInfo, setImageInfo] = useRecoilState(customMapStore_imageInfo);
  const resetImageInfo = useResetRecoilState(customMapStore_imageInfo);
  const [markers, setMarkers] = useRecoilState(customMapStore_markers);
  const resetMarkers = useResetRecoilState(customMapStore_markers);

  /**
   * Reset the entire store state to it's defaults.
   */
  const reset = () => {
    resetImageInfo();
    resetMarkers();
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
    resetMarkers();
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
    if (markers.size >= 3) return;
    const newMarkers = new Map(markers);
    const newId = crypto.randomUUID();
    // Add it to the center of the map
    newMarkers.set(newId, { displayCoordinates: center, intendedCoordinates: EMPTY_POINT });
    setMarkers(newMarkers);
  };

  /**
   * Getter method to get the exact marker from the store, by id.
   * @param markerId The id of the marker we want.
   * @returns The marker with the given id.
   */
  const getMarker = (markerId: string) => markers.get(markerId);

  /**
   * Auxiliary function to modify a marker with new partial data.
   * @param markerId The id of the marker we want.
   * @param newData A partial marker with the new information to be modified
  */
  const modifyMarker = (markerId: string, newData: Partial<InputMarker>) => {
    const originalMarker = markers.get(markerId);
    if (!originalMarker) return;
    const newMarkers = new Map(markers);
    newMarkers.set(markerId, { ...originalMarker, ...newData });
    setMarkers(newMarkers);
  };

  /**
   * Set a marker's display position (position in the Leaflet map).
   * @param markerId The marker's id.
   * @param newCoordinates The new position.
   */
  const setMarkerDisplayCoordinates = (markerId: string, newCoordinates: Point) => {
    modifyMarker(markerId, { displayCoordinates: newCoordinates });
  };

  /**
   * Set a marker's intended position (position in game).
   * @param markerId The marker's id.
   * @param newCoordinates The new position.
   */
  const setMarkerIntendedCoordinates = (markerId: string, newCoordinates: Point) => {
    modifyMarker(markerId, { intendedCoordinates: newCoordinates });
  };

  /**
   * Remove an existing marker.
   * @param markerId The marker's id.
   */
  const removeMarker = (markerId: string) => {
    const newMarkers = new Map(markers);
    newMarkers.delete(markerId);
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
    setMarkerDisplayCoordinates,
    setMarkerIntendedCoordinates,
    removeMarker,
  };
}

export default useCustomMapStore;
