import { EntityId } from '@reduxjs/toolkit';

import createTabbedContext from '../../common/TabbedContext';

export type TabId = 'addStructure' | 'realms' | 'settings';

export const {
  useContext: useActionBarContext,
  ContextProvider: ActionBarContextProvider,
} = createTabbedContext<TabId, EntityId>();
