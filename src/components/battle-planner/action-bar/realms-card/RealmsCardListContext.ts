import { EntityId } from '@reduxjs/toolkit';

import createTabbedContext from '../../../common/TabbedContext';

export const {
  useContext: useRealmsCardListContext,
  ContextProvider: RealmsCardListContextProvider,
} = createTabbedContext<EntityId>();
