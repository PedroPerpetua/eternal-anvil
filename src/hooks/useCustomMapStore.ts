import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import { fromTriangles, applyToPoint } from 'transformation-matrix';
import { readFileAsURL, readImageFromURL } from '../utilities';
import { Point } from '../types';


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
 * Store to handle everything related to using a custom map for the planner.
 * @returns Functions that allow to modify the global state.
 */
function useCustomMapStore() {
  const [imageInfo, setImageInfo] = useRecoilState(
    customMapStore_imageInfo,
  );
  const imageInfoReset = useResetRecoilState(customMapStore_imageInfo);
  const [markers, setMarkers] = useRecoilState(
    customMapStore_markers,
  );
  const markersReset = useResetRecoilState(customMapStore_markers);

  /**
   * Reset the entire store state to it's defaults.
   */
  const reset = () => {
    imageInfoReset();
    markersReset();
  };

  /**
   * Center of the current selected map; [Infinity, Infinity] if there's no
   * custom map.
   */
  const center: Point = imageInfo
    ? [imageInfo.height / 2, imageInfo.width / 2]
    : [Infinity, Infinity];


  /**
   * Compute the resulting transformation matrix to be applied to points.
   */
  const affineTransformationMatrix = markers.size < 3
    ? null
    : fromTriangles(
      [...markers.values()].map((p) => p.intendedCoordinates),
      [...markers.values()].map((p) => p.displayCoordinates),
    );

  const translateArkheimPoint = (point: Point) => {
    if (affineTransformationMatrix === null) return [NaN, NaN] as Point;
    return applyToPoint(affineTransformationMatrix, point) as Point;
  };

  /* Handle imageInfo ------------------------------------------------------*/

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


  /* Handle markers --------------------------------------------------------*/

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
    center,
    translateArkheimPoint,
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
