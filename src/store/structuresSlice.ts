import { createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';

import { startListening } from './listenerMiddleware';
import { deleteRealm } from './realmsSlice';
import { StructureType } from '../utils/gameData';
import { Point } from '../utils/math';
import { generateId } from '../utils/utilities';

type Structure = {
  id: EntityId,
  realm: EntityId | null,
  type: StructureType,
  coordinates: Point
};

const structuresAdapter = createEntityAdapter<Structure>();
export const structuresSelectors = structuresAdapter.getSelectors();

const structuresSlice = createSlice({
  name: 'structures',
  initialState: structuresAdapter.getInitialState(),
  reducers: {
    createStructure: (state, action: PayloadAction<Omit<Structure, 'id'>>) => {
      // Auto-generate an Id on creation
      structuresAdapter.addOne(state, { ...action.payload, id: generateId() });
    },
    updateStructure: structuresAdapter.updateOne,
    deleteStructure: structuresAdapter.removeOne,
    cascadeRealmDelete: (state, action: PayloadAction<EntityId>) => {
      const toRemove = structuresSelectors.selectAll(state)
        .filter((s) => s.realm === action.payload)
        .map((s) => s.id);
      return structuresAdapter.removeMany(state, toRemove);
    },
  },
});

export const { createStructure, updateStructure, deleteStructure } = structuresSlice.actions;

// Bind the cascadeRealmDelete - when we delete a realm, all of it's structures should be deleted
startListening({
  actionCreator: deleteRealm,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(structuresSlice.actions.cascadeRealmDelete(action.payload));
  },
});

export default structuresSlice.reducer;
