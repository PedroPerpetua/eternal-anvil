import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { deleteStructure } from './structuresSlice';
import { generateId } from '../../../utils/utilities';
import { startListening } from '../../listenerMiddleware';

type Edge = {
  id: EntityId,
  structure1: EntityId,
  structure2: EntityId,
};

const edgesAdapter = createEntityAdapter<Edge>();
export const edgesSelectors = edgesAdapter.getSelectors();
const extraInitialState: { currentlySelected: EntityId | null } = {
  currentlySelected: null,
};

const edgesSlice = createSlice({
  name: 'edges',
  initialState: edgesAdapter.getInitialState(extraInitialState),
  reducers: {
    selectStructure: (state, action: PayloadAction<EntityId>) => {
      if (state.currentlySelected === null) {
        state.currentlySelected = action.payload;
        return;
      }
      if (state.currentlySelected === action.payload) return;
      const newEdge: Edge = {
        id: generateId(),
        structure1: state.currentlySelected,
        structure2: action.payload,
      };
      // See if an edge already exists for both of those
      if (edgesSelectors.selectAll(state).some((edge) => (
        (edge.structure1 === newEdge.structure1 && edge.structure2 === newEdge.structure2)
        || (edge.structure1 === newEdge.structure2 && edge.structure2 === newEdge.structure1)
      ))) return;
      edgesAdapter.addOne(state, newEdge);
      state.currentlySelected = null;
    },
    deselectStructure: (state) => {
      state.currentlySelected = null;
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

export const { selectStructure, deselectStructure, deleteEdge } = edgesSlice.actions;
export default edgesSlice.reducer;

// Bind the cascadeStructureDelete - when we delete a structures, all the edges that include it
// should be removed
startListening({
  actionCreator: deleteStructure,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(edgesSlice.actions.cascadeStructureDelete(action.payload));
  },
});
