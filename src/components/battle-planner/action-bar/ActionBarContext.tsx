import {
  createContext, useContext, useState, PropsWithChildren, useMemo,
} from 'react';

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
    <ActionBarContext.Provider value={memoizedContext}>
      { children }
    </ActionBarContext.Provider>
  );
}
