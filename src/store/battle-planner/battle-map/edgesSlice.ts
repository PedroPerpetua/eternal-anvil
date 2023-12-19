import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import { realmsSelectors } from './realmsSlice';
import { structuresActions, structuresSelectors } from './structuresSlice';
import type { RootState } from '../..';
import { blendColors } from '../../../utils/images';
import { generateId } from '../../../utils/utilities';
import { startListening } from '../../listenerMiddleware';

type Edge = {
  id: EntityId,
  structure1: EntityId,
  structure2: EntityId,
};

function generateEdge(structure1: EntityId, structure2: EntityId) {
  return {
    id: generateId(),
    structure1,
    structure2,
  } as Edge;
}

const edgesAdapter = createEntityAdapter<Edge>();
const edgesEntitySelectors = edgesAdapter.getSelectors();

// Slice
const edgesSlice = createSlice({
  name: 'edges',
  initialState: edgesAdapter.getInitialState({ currentlySelected: null as EntityId | null }),
  reducers: {
    selectStructure: (state, action: PayloadAction<{ structureId: EntityId }>) => {
      const { structureId } = action.payload;
      if (state.currentlySelected === null) {
        state.currentlySelected = structureId;
        return;
      }
      if (state.currentlySelected === structureId) return;
      const newEdge = generateEdge(state.currentlySelected, structureId);
      // See if an edge already exists for both of those
      if (edgesEntitySelectors.selectAll(state).some((edge) => (
        (edge.structure1 === newEdge.structure1 && edge.structure2 === newEdge.structure2)
        || (edge.structure1 === newEdge.structure2 && edge.structure2 === newEdge.structure1)
      ))) return;
      edgesAdapter.addOne(state, newEdge);
      state.currentlySelected = null;
    },
    deselectStructure: (state) => {
      state.currentlySelected = null;
    },
    deleteEdge: (state, action: PayloadAction<{ edgeId: EntityId }>) => {
      const { edgeId } = action.payload;
      edgesAdapter.removeOne(state, edgeId);
    },
    cascadeStructureDelete: (state, action: PayloadAction<{ structureId: EntityId }>) => {
      const { structureId } = action.payload;
      const toRemove = edgesEntitySelectors.selectAll(state)
        .filter((e) => e.structure1 === structureId || e.structure2 === structureId)
        .map((e) => e.id);
      return edgesAdapter.removeMany(state, toRemove);
    },
  },
});

// Actions
export const edgesActions = edgesSlice.actions;

// Selectors
export const edgesSelectors = {
  entitySelectors: edgesEntitySelectors,
  getEdge: createSelector(
    [
      (state: RootState) => state.battlePlanner.battleMap.edges,
      (state: RootState, edgeId: EntityId) => edgeId,
    ],
    (edges, edgeId) => edgesEntitySelectors.selectById(edges, edgeId),
  ),
  getEdgeIds: createSelector(
    [(state: RootState) => state.battlePlanner.battleMap.edges],
    (edges) => edgesEntitySelectors.selectIds(edges),
  ),
  getEdgeData: createSelector(
    [
      (state: RootState) => state.battlePlanner.battleMap.edges,
      (state: RootState, edgeId: EntityId) => edgeId,
      (state: RootState) => state.battlePlanner.battleMap.structures,
      (state: RootState) => state.battlePlanner.battleMap.realms,
    ],
    (edges, edgeId, structures, realms) => {
      const edge = edgesEntitySelectors.selectById(edges, edgeId);
      const structure1 = structuresSelectors.entitySelectors
        .selectById(structures, edge.structure1);
      const realm1 = realmsSelectors.entitySelectors
        .selectById(realms, structure1.realm);
      const structure2 = structuresSelectors.entitySelectors
        .selectById(structures, edge.structure2);
      const realm2 = realmsSelectors.entitySelectors.selectById(realms, structure2.realm);
      return {
        start: structure1.coordinates,
        end: structure2.coordinates,
        color: blendColors(realm1.color, realm2.color),
      };
    },
  ),
  currentlySelected: createSelector(
    [(state: RootState) => state.battlePlanner.battleMap.structures,
      (state: RootState) => state.battlePlanner.battleMap.edges.currentlySelected],
    (structures, currentlySelected) => {
      if (!currentlySelected) return null;
      return structuresSelectors.entitySelectors.selectById(structures, currentlySelected);
    },
  ),
};

export default edgesSlice.reducer;

// Bind the cascadeStructureDelete - when we delete a structures, all the edges that include it
// should be removed
startListening({
  actionCreator: structuresActions.deleteStructure,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(edgesSlice.actions.cascadeStructureDelete(action.payload));
  },
});

// TODO: there's currently a bug where deleting a realm doesn't cascade to deleting an edge
// See https://stackoverflow.com/questions/77687174/
