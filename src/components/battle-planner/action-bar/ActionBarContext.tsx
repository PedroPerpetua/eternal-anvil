import {
  createContext, useContext, useState, PropsWithChildren, useMemo,
} from 'react';
import { ThemeProvider } from '@mui/material';

import actionBarTheme from './actionBarTheme';

export type TabId = 'addStructure' | 'realms' | 'settings';

type ActionBarContextValue = {
  currentTab: TabId | null
  setCurrentTab: (value: TabId | null) => void;
};

const ActionBarContext = createContext<ActionBarContextValue>({
  currentTab: null,
  setCurrentTab: () => {},
});

export function useActionBarContext() {
  return useContext(ActionBarContext);
}

type ActionBarContextProviderProps = PropsWithChildren<object>;

export function ActionBarContextProvider({ children }: ActionBarContextProviderProps) {
  const [currentTab, setCurrentTab] = useState<TabId | null>(null);
  const memoizedContext = useMemo(
    () => ({ currentTab, setCurrentTab }),
    [currentTab, setCurrentTab],
  );
  return (
    <ThemeProvider theme={actionBarTheme}>
      <ActionBarContext.Provider value={memoizedContext}>
        { children }
      </ActionBarContext.Provider>
    </ThemeProvider>
  );
}
