import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import type { EntityId, PayloadAction } from '@reduxjs/toolkit';

import type { RootState } from '../..';
import { DEFAULT_REALM_COLORS, NEUTRAL_COLOR } from '../../../utils/gameData';
import { generateId } from '../../../utils/utilities';

type Realm = {
  id: EntityId,
  name: string,
  color: string,
};
type RealmPayload = Omit<Realm, 'id'>;

const realmsAdapter = createEntityAdapter<Realm>();
const realmsEntitySelectors = realmsAdapter.getSelectors();

// Slice
const realmsSlice = createSlice({
  name: 'realms',
  initialState: realmsAdapter.addMany(realmsAdapter.getInitialState(), [
    { id: generateId(), name: 'Neutral', color: NEUTRAL_COLOR },
    { id: generateId(), name: 'My Realm', color: DEFAULT_REALM_COLORS[0] },
  ]),
  reducers: {
    createRealm: (state, action: PayloadAction<RealmPayload>) => {
      // Auto-generate an Id on creation
      realmsAdapter.addOne(state, { ...action.payload, id: generateId() });
    },
    updateRealm: (
      state,
      action: PayloadAction<{ realmId: EntityId, changes: Partial<RealmPayload> }>,
    ) => {
      const { realmId, changes } = action.payload;
      realmsAdapter.updateOne(state, { id: realmId, changes });
    },
    deleteRealm: (state, action: PayloadAction<{ realmId: EntityId }>) => {
      const { realmId } = action.payload;
      realmsAdapter.removeOne(state, realmId);
    },
  },
});

// Actions
export const realmsActions = realmsSlice.actions;

// Selectors
export const realmsSelectors = {
  entitySelectors: realmsEntitySelectors,
  getRealm: createSelector(
    [
      (state: RootState) => state.battlePlanner.battleMap.realms,
      (state: RootState, realmId: EntityId) => realmId,
    ],
    (realms, realmId) => realmsEntitySelectors.selectById(realms, realmId),
  ),
  getRealmIds: createSelector(
    [(state: RootState) => state.battlePlanner.battleMap.realms],
    (realms) => realmsEntitySelectors.selectIds(realms),
  ),
  getRealms: createSelector(
    [(state: RootState) => state.battlePlanner.battleMap.realms],
    (realms) => realmsEntitySelectors.selectAll(realms),
  ),
};

export default realmsSlice.reducer;
