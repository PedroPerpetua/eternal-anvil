import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

import battlePlannerReducers from './battle-planner';
import { edgesActions } from './battle-planner/battle-map/edgesSlice';
import { realmsActions } from './battle-planner/battle-map/realmsSlice';
import { structuresActions, structuresSelectors } from './battle-planner/battle-map/structuresSlice';
import distanceCalculatorReducers from './distance-calculator';
import { listenerMiddleware, startListening } from './listenerMiddleware';

const store = configureStore({
  reducer: {
    battlePlanner: battlePlannerReducers,
    distanceCalculator: distanceCalculatorReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware),
});

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch: () => typeof store.dispatch = useDispatch;

export default store;

// We put the cascade deletes here, to prevent circular imports.

// When we delete a structure, delete all edges
startListening({
  actionCreator: structuresActions.deleteStructure,
  effect: async (action, listenerApi) => {
    const { structureId } = action.payload;
    listenerApi.dispatch(
      edgesActions.cascadeStructureDelete({ structureIds: [structureId] }),
    );
  },
});

// When we delete a realm, delete all structures and edges
startListening({
  actionCreator: realmsActions.deleteRealm,
  effect: async (action, listenerApi) => {
    const { realmId } = action.payload;
    // This is a "hacky" solution to find all structures belonging to the realm that's been deleted,
    // so we can cascade them into the edges cascade
    // Unanswered: https://stackoverflow.com/questions/77687174
    // Delete all the realm's edges
    const state = store.getState();
    const structureIds = structuresSelectors.getStructureIdsForRealm(state, realmId);
    listenerApi.dispatch(edgesActions.cascadeStructureDelete({ structureIds }));
    // Delete all the realm's structures
    listenerApi.dispatch(structuresActions.cascadeRealmDelete({ realmId }));
  },
});
