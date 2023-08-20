import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { generateId } from '../utils/utilities';

type Realm = {
  id: EntityId,
  name: string,
  color: string,
};

const realmsAdapter = createEntityAdapter<Realm>();
const initialState = realmsAdapter.addOne(
  realmsAdapter.getInitialState(),
  { id: generateId(), name: 'My Realm', color: '#115aad' },
);

const realmsSlice = createSlice({
  name: 'realms',
  initialState,
  reducers: {
    createRealm: (state, action: PayloadAction<Omit<Realm, 'id'>>) => {
      // Auto-generate an Id on creation
      realmsAdapter.addOne(state, { ...action.payload, id: generateId() });
    },
    updateRealm: realmsAdapter.updateOne,
    deleteRealm: realmsAdapter.removeOne,
  },
});

export const { createRealm, updateRealm, deleteRealm } = realmsSlice.actions;
export const realmSelectors = realmsAdapter.getSelectors();
export default realmsSlice.reducer;
