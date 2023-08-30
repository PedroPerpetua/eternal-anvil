/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  PropsWithChildren, createContext, useCallback, useMemo, useContext as useReactContext, useState,
} from 'react';

type TabbedContextValue<T, P = any> = {
  current: T | null
  setCurrent: (value: T | null, newPayload?: P | null) => void;
  payload: P | null
};

function createTabbedContext<T, P = any>(startingTab: T | null = null) {
  const Context = createContext<TabbedContextValue<T, P>>({
    current: startingTab,
    setCurrent: () => {},
    payload: null,
  });

  function useContext() {
    return useReactContext(Context);
  }

  function ContextProvider({ children }: PropsWithChildren<object>) {
    const [current, setCurrent] = useState<T | null>(startingTab);
    const [payload, setPayload] = useState<P | null>(null);
    const handleSetCurrent = useCallback((value: T | null, newPayload?: P | null) => {
      setPayload(null);
      setCurrent(value);
      if (newPayload !== undefined) setPayload(newPayload);
    }, [setCurrent]);
    const memoizedContext = useMemo(
      () => ({ current, setCurrent: handleSetCurrent, payload }),
      [current, handleSetCurrent, payload],
    );
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
