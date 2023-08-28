import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import edgesReducer from './battleMap/edgesSlice';
import mapInfoReducer from './battleMap/mapInfoSlice';
import realmsReducer from './battleMap/realmsSlice';
import structuresReducer from './battleMap/structuresSlice';
import { listenerMiddleware } from './listenerMiddleware';

const battleMapReducers = combineReducers({
  realms: realmsReducer,
  structures: structuresReducer,
  edges: edgesReducer,
  mapInfo: mapInfoReducer,
});

const store = configureStore({
  reducer: {
    battleMap: battleMapReducers,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware),
});

// Typed hooks
export type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
