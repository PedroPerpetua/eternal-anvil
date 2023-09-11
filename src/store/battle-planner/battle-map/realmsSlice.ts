import { EntityId, PayloadAction, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import { DEFAULT_REALM_COLORS, NEUTRAL_COLOR } from '../../../utils/gameData';
import { generateId } from '../../../utils/utilities';

type Realm = {
  id: EntityId,
  name: string,
  color: string,
};

const realmsAdapter = createEntityAdapter<Realm>();
const initialState = realmsAdapter.addMany(realmsAdapter.getInitialState(), [
  { id: generateId(), name: 'Neutral', color: NEUTRAL_COLOR },
  { id: generateId(), name: 'My Realm', color: DEFAULT_REALM_COLORS[0] },
]);

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
