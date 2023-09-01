import { EntityId } from '@reduxjs/toolkit';

import createTabbedContext from '../../common/TabbedContext';

export type TabId = 'addStructure' | 'realms' | 'map';

export const {
  useContext: useActionBarContext,
  ContextProvider: ActionBarContextProvider,
} = createTabbedContext<TabId, EntityId>();
