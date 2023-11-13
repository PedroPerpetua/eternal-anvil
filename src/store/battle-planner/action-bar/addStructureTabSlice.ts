import { EntityId, PayloadAction, createSlice } from '@reduxjs/toolkit';

import { EMPTY_POINT, Point } from '../../../utils/math';

type AddStructureTabData = {
  coordinates: Point,
  selectedRealm: EntityId | '',
};

const initialState: AddStructureTabData = {
  coordinates: EMPTY_POINT,
  selectedRealm: '',
};

const addStructureTabSlice = createSlice({
  name: 'addStructureTab',
  initialState,
  reducers: {
    setCoordinates: (state, action: PayloadAction<Point>) => {
      state.coordinates = action.payload;
    },
    selectRealm: (state, action: PayloadAction<EntityId | ''>) => {
      state.selectedRealm = action.payload;
    },
  },
});

export const { setCoordinates, selectRealm } = addStructureTabSlice.actions;
export default addStructureTabSlice.reducer;
