import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import edgesReducer from './edgesSlice';
import { listenerMiddleware } from './listenerMiddleware';
import mapInfoReducer from './mapInfoSlice';
import realmsReducer from './realmsSlice';
import structuresReducer from './structuresSlice';

const store = configureStore({
  reducer: {
    realms: realmsReducer,
    structures: structuresReducer,
    edges: edgesReducer,
    mapInfo: mapInfoReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware),
});

// Typed hooks
type RootState = ReturnType<typeof store.getState>;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

export default store;
