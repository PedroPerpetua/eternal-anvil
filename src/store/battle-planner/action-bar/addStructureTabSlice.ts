import { createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';
import { StructureType } from '../../../utils/gameData';
import { EMPTY_POINT } from '../../../utils/math';
import type { Point } from '../../../utils/math';

const DEFAULT_STRUCTURE_TYPE: StructureType = 'TOWER';

// Slice
const addStructureTabSlice = createSlice({
  name: 'addStructureTab',
  initialState: {
    coordinates: EMPTY_POINT,
    selectedRealm: null as EntityId | null,
    structureType: DEFAULT_STRUCTURE_TYPE as StructureType,
  },
  reducers: {
    setCoordinates: (state, action: PayloadAction<Point>) => {
      state.coordinates = action.payload;
    },
    setSelectedRealm: (state, action: PayloadAction<{ realmId: EntityId | null }>) => {
      state.selectedRealm = action.payload.realmId;
    },
    setStructureType: (state, action: PayloadAction<StructureType>) => {
      state.structureType = action.payload;
    },
  },
});

// Actions
export const addStructureTabActions = addStructureTabSlice.actions;

// Selectors
export const addStructureTabSelectors = {
  coordinates: (state: RootState) => state.battlePlanner.actionBar.addStructureTab.coordinates,
  selectedRealm: (state: RootState) => state.battlePlanner.actionBar.addStructureTab.selectedRealm,
  structureType: (state: RootState) => state.battlePlanner.actionBar.addStructureTab.structureType,
};

export default addStructureTabSlice.reducer;
