import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type ActionBarTabId = 'addStructure' | 'realms' | 'edges' | 'map' | null;

const currentTabSlice = createSlice({
  name: 'currentTab',
  initialState: null as ActionBarTabId,
  reducers: {
    changeTab: (state, action: PayloadAction<ActionBarTabId>) => action.payload,
  },
});

export const { changeTab } = currentTabSlice.actions;

export default currentTabSlice.reducer;
