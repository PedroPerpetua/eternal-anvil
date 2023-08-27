import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Matrix } from 'transformation-matrix';

import { computeAffineMatrix } from '../utils/math';

type MapInfo = {
  image: string | null,
  transformationMatrix: Matrix,
  dragging: boolean,
};

// By default, apply a rotation that "mimics" the game (close enough)
const rotationSin = Math.sin(Math.PI / 4);
const scale = 35;
const initialMatrix = computeAffineMatrix(
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [scale * rotationSin, scale * rotationSin], [0, scale * 2 * rotationSin]],
);

const initialState: MapInfo = {
  image: null,
  transformationMatrix: initialMatrix,
  dragging: false,
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
  },
});

export const { setMapInfo, setDragging } = mapInfoSlice.actions;

export default mapInfoSlice.reducer;
