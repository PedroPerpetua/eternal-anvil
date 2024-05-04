import {
  createContext, createRef, useContext, useEffect, useMemo, useRef,
  useState,
} from 'react';
import type { PropsWithChildren, RefObject } from 'react';
import { Alert, Portal, Snackbar } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { useScreenshot } from 'use-react-screenshot';

type TakeScreenshotContextType = {
  elementRef: RefObject<HTMLDivElement>,
  takeScreenshot: () => void;
};

const TakeScreenshotContext = createContext<TakeScreenshotContextType>({
  elementRef: createRef(),
  takeScreenshot: () => {},
});

function TakeScreenshotContextProvider({ children }: PropsWithChildren<object>) {
  const ref = useRef<HTMLDivElement>(null);
  const [image, takeScreenshot] = useScreenshot();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');

  useEffect(() => {
    if (image === null) return;
    const effect = async () => {
      try {
        const imgFile = await fetch(image);
        const blob = await imgFile.blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setSnackbarSeverity('success');
        setSnackbarMessage('Successfully copied image to clipboard.');
      } catch (e) {
        setSnackbarMessage('An error occurred: failed to copy image to clipboard.');
        console.error('Failed to copy image to clipboard', e);
      }
    };
    effect();
  }, [image]);

  const value: TakeScreenshotContextType = useMemo(() => ({
    elementRef: ref,
    takeScreenshot: () => {
      if (!ref.current) return;
      takeScreenshot(ref.current);
    },
  }), [takeScreenshot]);
  return (
    <>
      <TakeScreenshotContext.Provider value={value}>
        { children }
      </TakeScreenshotContext.Provider>
      <Portal>
        <Snackbar
          open={Boolean(snackbarMessage)}
          onClose={() => setSnackbarMessage('')}
          autoHideDuration={6000}
        >
          <Alert
            onClose={() => setSnackbarMessage('')}
            variant="filled"
            severity={snackbarSeverity}
          >
            { snackbarMessage }
          </Alert>
        </Snackbar>
      </Portal>
    </>
  );
}

export default TakeScreenshotContextProvider;

export function useTakeScreenshot() {
  return useContext(TakeScreenshotContext).takeScreenshot;
}

export function useTakeScreenshotRef() {
  return useContext(TakeScreenshotContext).elementRef;
}
