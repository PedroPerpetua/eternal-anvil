import { useCallback, useEffect, useRef, useState } from 'react';

function useElementDimensions() {
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const observer = useRef(new ResizeObserver((entries) => {
    // We should only ever have one entry
    const node = entries.at(0);
    if (!node) return;
    const { width: newWidth, height: newHeight } = node.contentRect;
    setWidth(newWidth);
    setHeight(newHeight);
  }));

  const ref = useCallback((node: HTMLElement | null) => {
    if (!node) return;
    // Set the initial dimensions
    const { width: initialWidth, height: initialHeight } = node.getBoundingClientRect();
    setWidth(initialWidth);
    setHeight(initialHeight);
    // Observe it
    observer.current.observe(node);
  }, []);

  // Disconnect on unmount
  useEffect(() => () => { observer.current.disconnect(); }, []);

  return { ref, width, height } as const;
}

export default useElementDimensions;
