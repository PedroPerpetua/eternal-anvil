import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type EdgeToolMode = 'view' | 'select' | 'delete';

type InitialStateType = {
  toolMode: EdgeToolMode,
};

const edgesTabSlice = createSlice({
  name: 'edgesTabSlice',
  initialState: {
    toolMode: 'view',
  } as InitialStateType,
  reducers: {
    changeMode: (state, action: PayloadAction<EdgeToolMode>) => {
      state.toolMode = action.payload;
    },
  },
});

export const { changeMode } = edgesTabSlice.actions;
export default edgesTabSlice.reducer;
