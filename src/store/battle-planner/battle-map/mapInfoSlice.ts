import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Matrix } from 'transformation-matrix';

import type { RootState } from '../..';
import { EMPTY_POINT, computeAffineMatrix } from '../../../utils/math';
import type { Point } from '../../../utils/math';

// By default, apply a rotation that "mimics" the game (close enough)
const rotationSin = Math.sin(Math.PI / 4);
const scale = 35;
const initialMatrix = computeAffineMatrix(
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [scale * rotationSin, scale * rotationSin], [0, scale * 2 * rotationSin]],
);

// Slice
const initialState = {
  image: null as string | null,
  transformationMatrix: initialMatrix,
  dragging: false,
  currentMouseHover: EMPTY_POINT,
};

const mapInfoSlice = createSlice({
  name: 'mapInfo',
  initialState,
  reducers: {
    setMapInfo: (state, action: PayloadAction<{ image: string, transformationMatrix: Matrix }>) => {
      state.image = action.payload.image;
      state.transformationMatrix = action.payload.transformationMatrix;
    },
    setDragging: (state, action: PayloadAction<boolean>) => {
      state.dragging = action.payload;
    },
    setCurrentMouseHover: (state, action: PayloadAction<Point>) => {
      state.currentMouseHover = action.payload;
    },
  },
});

// Actions
export const mapInfoActions = mapInfoSlice.actions;

// Selectors
export const mapInfoSelectors = {
  image: (state: RootState) => state.battlePlanner.battleMap.mapInfo.image,
  transformationMatrix: (
    state: RootState,
  ) => state.battlePlanner.battleMap.mapInfo.transformationMatrix,
  dragging: (state: RootState) => state.battlePlanner.battleMap.mapInfo.dragging,
  currentMouseHover: (state: RootState) => state.battlePlanner.battleMap.mapInfo.currentMouseHover,
};

export default mapInfoSlice.reducer;
