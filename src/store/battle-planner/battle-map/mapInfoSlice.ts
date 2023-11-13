import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Matrix } from 'transformation-matrix';

import { EMPTY_POINT, Point, computeAffineMatrix } from '../../../utils/math';

// By default, apply a rotation that "mimics" the game (close enough)
const rotationSin = Math.sin(Math.PI / 4);
const scale = 35;
const initialMatrix = computeAffineMatrix(
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [scale * rotationSin, scale * rotationSin], [0, scale * 2 * rotationSin]],
);

type MapInfo = {
  image: string | null,
  transformationMatrix: Matrix,
  dragging: boolean,
  currentMouseHover: Point,
};

const initialState: MapInfo = {
  image: null,
  transformationMatrix: initialMatrix,
  dragging: false,
  currentMouseHover: EMPTY_POINT,
};

const mapInfoSlice = createSlice({
  name: 'mapInfo',
  initialState,
  reducers: {
    setMapInfo: (state, action: PayloadAction<Pick<MapInfo, 'image' | 'transformationMatrix'>>) => {
      state.image = action.payload.image;
      state.transformationMatrix = action.payload.transformationMatrix;
    },
    setDragging: (state, action: PayloadAction<MapInfo['dragging']>) => {
      state.dragging = action.payload;
    },
    setCurrentMouseHover: (state, action: PayloadAction<MapInfo['currentMouseHover']>) => {
      state.currentMouseHover = action.payload;
    },
  },
});

export const { setMapInfo, setDragging, setCurrentMouseHover } = mapInfoSlice.actions;
export default mapInfoSlice.reducer;
