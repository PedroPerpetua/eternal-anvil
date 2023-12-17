import { createSelector, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';

export type ActionBarTabId = 'addStructure' | 'realms' | 'edges' | 'map' | null;

// Slice
const currentTabSlice = createSlice({
  name: 'currentTab',
  initialState: null as ActionBarTabId,
  reducers: {
    changeTab: (state, action: PayloadAction<ActionBarTabId>) => action.payload,
  },
});

// Actions
export const currentTabActions = currentTabSlice.actions;

// Selectors
export const currentTabSelectors = {
  tabIsActive: createSelector(
    [
      (state: RootState) => state.battlePlanner.actionBar.currentTab,
      (state: RootState, tabId: ActionBarTabId) => tabId,
    ],
    (currentTab, tabId) => currentTab === tabId,
  ),
};

export default currentTabSlice.reducer;
