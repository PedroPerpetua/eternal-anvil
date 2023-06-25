import { useMapEvent } from 'react-leaflet';
import { atom, useSetRecoilState } from 'recoil';

/* eslint-disable-next-line @typescript-eslint/naming-convention */
export const battleMap_draggingMap = atom<boolean>({
  key: 'battleMap_draggingMap',
  default: false,
});

function MapDragController() {
  const setDraggingMap = useSetRecoilState(battleMap_draggingMap);
  useMapEvent('dragstart', () => setDraggingMap(true));
  useMapEvent('dragend', () => setDraggingMap(false));
  return null;
}

export default MapDragController;
