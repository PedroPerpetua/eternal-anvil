import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import { realmsActions, realmsSelectors } from './realmsSlice';
import type { RootState } from '../..';
import { STRUCTURES_DATA } from '../../../utils/gameData';
import type { StructureType } from '../../../utils/gameData';
import type { Point } from '../../../utils/math';
import { generateId } from '../../../utils/utilities';
import { startListening } from '../../listenerMiddleware';

type Structure = {
  id: EntityId,
  realm: EntityId,
  type: StructureType,
  coordinates: Point
};
type StructurePayload = Omit<Structure, 'id'>;

const structuresAdapter = createEntityAdapter<Structure>();
const structuresEntitySelectors = structuresAdapter.getSelectors();

// Slice
const structuresSlice = createSlice({
  name: 'structures',
  initialState: structuresAdapter.getInitialState(),
  reducers: {
    createStructure: (state, action: PayloadAction<StructurePayload>) => {
      // Auto-generate an Id on creation
      structuresAdapter.addOne(state, { ...action.payload, id: generateId() });
    },
    updateStructure: (
      state,
      action: PayloadAction<{ structureId: EntityId, changes: Partial<StructurePayload> }>,
    ) => {
      const { structureId, changes } = action.payload;
      structuresAdapter.updateOne(state, { id: structureId, changes });
    },
    deleteStructure: (state, action: PayloadAction<{ structureId: EntityId }>) => {
      const { structureId } = action.payload;
      structuresAdapter.removeOne(state, structureId);
    },
    cascadeRealmDelete: (state, action: PayloadAction<{ realmId: EntityId }>) => {
      const { realmId } = action.payload;
      const toRemove = structuresEntitySelectors.selectAll(state)
        .filter((s) => s.realm === realmId)
        .map((s) => s.id);
      return structuresAdapter.removeMany(state, toRemove);
    },
  },
});

// Actions
export const structuresActions = structuresSlice.actions;

// Selectors
export const structuresSelectors = {
  entitySelectors: structuresEntitySelectors,
  getStructure: createSelector(
    [
      (state: RootState) => state.battlePlanner.battleMap.structures,
      (state: RootState, structureId: EntityId) => structureId,
    ],
    (structures, structureId) => structuresEntitySelectors.selectById(structures, structureId),
  ),
  getStructureIds: createSelector(
    [(state: RootState) => state.battlePlanner.battleMap.structures],
    (structures) => structuresEntitySelectors.selectIds(structures),
  ),
  getStructureData: createSelector(
    [
      (state: RootState) => state.battlePlanner.battleMap.structures,
      (state: RootState, structureId: EntityId) => structureId,
      (state: RootState) => state.battlePlanner.battleMap.realms,
      (state: RootState) => state.battlePlanner.battleMap.edges.currentlySelected,
      (state: RootState) => state.battlePlanner.battleMap.mapInfo.currentMouseHover,
    ],
    (structures, structureId, realms, currentlySelected, currentMouseHover) => {
      const structure = structuresEntitySelectors.selectById(structures, structureId);
      const structureInfo = STRUCTURES_DATA[structure.type];
      const realm = realmsSelectors.entitySelectors.selectById(realms, structure.realm);
      const highlighted = (
        currentlySelected === structureId
        || (shallowEqual(structure.coordinates, currentMouseHover))
      );
      return {
        icon: structureInfo.icon,
        size: structureInfo.size,
        color: realm.color,
        position: structure.coordinates,
        highlighted,
      };
    },
  ),
  getStructureIdsForRealm: createSelector(
    [
      (state: RootState) => state.battlePlanner.battleMap.structures,
      (state: RootState, realmId: EntityId) => realmId,
    ],
    (structures, realmId) => (
      structuresEntitySelectors.selectAll(structures)
        .filter((s) => s.realm === realmId)
        .map((s) => s.id)
    ),
  ),
  occupiedCoordinates: createSelector(
    [(state: RootState) => state.battlePlanner.battleMap.structures],
    (structures) => structuresEntitySelectors.selectAll(structures).map((s) => s.coordinates),
  ),
};

export default structuresSlice.reducer;

// Bind the cascadeRealmDelete - when we delete a realm, all of it's structures should be deleted
startListening({
  actionCreator: realmsActions.deleteRealm,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(structuresSlice.actions.cascadeRealmDelete(action.payload));
  },
});
