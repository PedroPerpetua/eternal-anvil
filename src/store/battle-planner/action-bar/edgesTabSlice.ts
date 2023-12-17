import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';
import type { EdgeToolMode } from '../../../components/battle-planner/action-bar/edges-card/EdgeTools';

// Slice
const edgesTabSlice = createSlice({
  name: 'edgesTabSlice',
  initialState: {
    toolMode: 'view' as EdgeToolMode,
  },
  reducers: {
    setToolMode: (state, action: PayloadAction<EdgeToolMode>) => {
      state.toolMode = action.payload;
    },
  },
});

// Actions
export const edgesTabActions = edgesTabSlice.actions;

// Selectors
export const edgesTabSelectors = {
  toolMode: (state: RootState) => state.battlePlanner.actionBar.edgesTab.toolMode,
};

export default edgesTabSlice.reducer;
