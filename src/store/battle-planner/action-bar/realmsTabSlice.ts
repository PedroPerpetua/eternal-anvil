import { EntityId, PayloadAction, createSlice } from '@reduxjs/toolkit';

const realmsTabSlice = createSlice({
  name: 'addStructureTab',
  initialState: {
    deleteOpen: false,
    expandedRealm: null as null | EntityId,
  },
  reducers: {
    setExpandedRealm: (state, action: PayloadAction<EntityId | null>) => {
      state.expandedRealm = action.payload;
    },
    setOpenDelete: (state, action: PayloadAction<boolean>) => {
      state.deleteOpen = action.payload;
    },
  },
});

export const { setExpandedRealm, setOpenDelete } = realmsTabSlice.actions;
export default realmsTabSlice.reducer;
