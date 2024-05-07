import {
  createContext, createRef, useContext, useEffect, useMemo, useRef,
  useState,
} from 'react';
import type { PropsWithChildren, RefObject } from 'react';
import { Alert, Portal, Snackbar } from '@mui/material';
import type { AlertColor } from '@mui/material';
import { Image } from 'image-js';
import { useScreenshot } from 'use-react-screenshot';

import { ellipsizeText } from './utils';
import { backgroundColor } from '../../theme';
import { generateColoredImage } from '../common/utils';

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
  const [image, takeScreenshot] = useScreenshot({
    type: 'image/png',
    quality: 1.0,
  });
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');

  useEffect(() => {
    if (image === null) return;
    const effect = async () => {
      try {
        const imageVar = await Image.load(image);
        // Create a background margin
        const margin = 50;
        const output = generateColoredImage(
          backgroundColor,
          imageVar.width + margin * 2,
          imageVar.height + margin * 2,
        );
        // Put the image over the output, with the margin set appropriately
        for (let i = 0; i < imageVar.width; i += 1) {
          for (let j = 0; j < imageVar.height; j += 1) {
            output.setPixelXY(margin + i, margin + j, imageVar.getPixelXY(i, j));
          }
        }
        // Put the image in the clipboard
        const blob = await output.toBlob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setSnackbarSeverity('success');
        setSnackbarMessage('Successfully copied image to clipboard.');
      } catch (e) {
        setSnackbarSeverity('error');
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
      takeScreenshot(ref.current, {
        backgroundColor,
        onclone: (doc, el) => {
          // Remove the non-active tabs
          el.querySelectorAll('[data-screenshot=\'tab-inactive\']').forEach((t) => t.remove());
          // Modify the tab
          const tab = el.querySelector<HTMLDivElement>('[data-screenshot=\'tab-active\']');
          if (!tab) return;
          // Remove all buttons
          tab.querySelector('[data-screenshot=\'buttons-container\']')?.remove();
          // Remove the add button
          if (tab.nextElementSibling) tab.parentElement?.removeChild(tab.nextElementSibling);
          // Remove the right border
          tab.style.borderRightWidth = '0px';
          // Center the title and add ellipsis if needed
          const title = tab.querySelector('p');
          if (title) {
            // Center the title
            title.style.paddingTop = '5px';
            title.style.textAlign = 'center';
            title.style.width = '100%';
            // Ellipsize-it; See https://github.com/niklasvh/html2canvas/issues/2262
            title.textContent = ellipsizeText(
              title.textContent ?? '',
              window.getComputedStyle(title).getPropertyValue('font'),
              el.getBoundingClientRect().width - 24,
            );
          }
        },
      });
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
