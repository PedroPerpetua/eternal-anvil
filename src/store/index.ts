import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import battleMapReducers from './battleMap';
import { listenerMiddleware } from './listenerMiddleware';

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
