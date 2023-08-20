import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Matrix } from 'transformation-matrix';

import { computeAffineMatrix } from '../utils/math';

type MapInfo = {
  image: string | null, transformationMatrix: Matrix
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
};

const mapInfoSlice = createSlice({
  name: 'mapInfo',
  initialState,
  reducers: {
    setMapInfo: (state, action: PayloadAction<MapInfo>) => action.payload,
  },
});

export const { setMapInfo } = mapInfoSlice.actions;

export default mapInfoSlice.reducer;
