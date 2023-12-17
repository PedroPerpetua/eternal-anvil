import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';

// Id for the "create realm" card
export const CREATE_REALM_ID = 'create';

// Slice
const realmsTabSlice = createSlice({
  name: 'realmsTab',
  initialState: {
    openRealm: null as null | EntityId,
    showDelete: false,
  },
  reducers: {
    setOpenRealm: (
      state,
      action: PayloadAction<{ realmId: EntityId | typeof CREATE_REALM_ID | null }>,
    ) => {
      state.openRealm = action.payload.realmId;
    },
    setShowDelete: (state, action: PayloadAction<boolean>) => {
      state.showDelete = action.payload;
    },
  },
});

// Actions
export const realmsTabActions = realmsTabSlice.actions;

// Selectors
export const realmsTabSelectors = {
  openRealm: (state: RootState) => state.battlePlanner.actionBar.realmsTab.openRealm,
  realmIsOpen: createSelector(
    [
      (state: RootState) => state.battlePlanner.actionBar.realmsTab.openRealm,
      (state: RootState, realmId: EntityId | typeof CREATE_REALM_ID | null) => realmId,
    ],
    (openRealm, realmId) => openRealm === realmId,
  ),
  showDelete: (state: RootState) => state.battlePlanner.actionBar.realmsTab.showDelete,
};

export default realmsTabSlice.reducer;
