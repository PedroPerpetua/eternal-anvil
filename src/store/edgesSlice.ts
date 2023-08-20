import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { startListening } from './listenerMiddleware';
import { deleteStructure } from './structuresSlice';
import { generateId } from '../utils/utilities';

type Edge = {
  id: EntityId,
  structure1: EntityId,
  structure2: EntityId,
};

const edgesAdapter = createEntityAdapter<Edge>();
export const edgesSelectors = edgesAdapter.getSelectors();

const extraInitialState: { selectionActive: boolean, currentlySelected: EntityId | null } = {
  selectionActive: false,
  currentlySelected: null,
};

const edgesSlice = createSlice({
  name: 'edges',
  initialState: edgesAdapter.getInitialState(extraInitialState),
  reducers: {
    toggleSelection: (state) => {
      state.selectionActive = !state.selectionActive;
      if (!state.selectionActive) state.currentlySelected = null;
    },
    selectStructureForEdge: (state, action: PayloadAction<EntityId>) => {
      if (!state.selectionActive) return;
      if (state.currentlySelected === null) state.currentlySelected = action.payload;
      else {
        edgesAdapter.addOne(state, {
          id: generateId(),
          structure1: state.currentlySelected,
          structure2: action.payload,
        });
        state.currentlySelected = null;
        state.selectionActive = false;
      }
    },
    deleteEdge: edgesAdapter.removeOne,
    cascadeStructureDelete: (state, action: PayloadAction<EntityId>) => {
      const toRemove = edgesSelectors.selectAll(state)
        .filter((e) => e.structure1 === action.payload || e.structure2 === action.payload)
        .map((e) => e.id);
      return edgesAdapter.removeMany(state, toRemove);
    },
  },
});

export const { toggleSelection, selectStructureForEdge, deleteEdge } = edgesSlice.actions;

// Bind the cascadeStructureDelete - when we delete a structures, all the edges that include it
// should be removed
startListening({
  actionCreator: deleteStructure,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(edgesSlice.actions.cascadeStructureDelete(action.payload));
  },
});

export default edgesSlice.reducer;
