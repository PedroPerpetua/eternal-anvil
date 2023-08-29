import createTabbedContext from '../../common/TabbedContext';

export type TabId = 'addStructure' | 'realms' | 'settings';

export const {
  useContext: useActionBarContext,
  ContextProvider: ActionBarContextProvider,
} = createTabbedContext<TabId>();
