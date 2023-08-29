import {
  PropsWithChildren, createContext, useMemo, useContext as useReactContext, useState,
} from 'react';

type TabbedContextValue<T> = {
  current: T | null
  setCurrent: (value: T | null) => void;
};

function createTabbedContext<T>(startingTab: T | null = null) {
  const Context = createContext<TabbedContextValue<T>>({
    current: startingTab,
    setCurrent: () => {},
  });

  function useContext() {
    return useReactContext(Context);
  }

  function ContextProvider({ children }: PropsWithChildren<object>) {
    const [current, setCurrent] = useState<T | null>(startingTab);
    const memoizedContext = useMemo(() => ({ current, setCurrent }), [current, setCurrent]);
    return (
      <Context.Provider value={memoizedContext}>
        { children }
      </Context.Provider>
    );
  }

  return {
    Context,
    useContext,
    ContextProvider,
  };
}

export default createTabbedContext;
