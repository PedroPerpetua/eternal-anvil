import { createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';
import { EMPTY_POINT } from '../../../utils/math';
import type { Point } from '../../../utils/math';

// Slice
const addStructureTabSlice = createSlice({
  name: 'addStructureTab',
  initialState: {
    coordinates: EMPTY_POINT,
    selectedRealm: null as EntityId | null,
  },
  reducers: {
    setCoordinates: (state, action: PayloadAction<Point>) => {
      state.coordinates = action.payload;
    },
    setSelectedRealm: (state, action: PayloadAction<{ realmId: EntityId | null }>) => {
      state.selectedRealm = action.payload.realmId;
    },
  },
});

// Actions
export const addStructureTabActions = addStructureTabSlice.actions;

// Selectors
export const addStructureTabSelectors = {
  coordinates: (state: RootState) => state.battlePlanner.actionBar.addStructureTab.coordinates,
  selectedRealm: (state: RootState) => state.battlePlanner.actionBar.addStructureTab.selectedRealm,
};

export default addStructureTabSlice.reducer;
