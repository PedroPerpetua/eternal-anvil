import { useEffect, useRef, useState } from 'react';
import {
  Alert, Box, Portal, Snackbar, Stack, Typography,
} from '@mui/material';
import type { AlertColor } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { EntityId } from '@reduxjs/toolkit';
import { useScreenshot } from 'use-react-screenshot';

import MiniDisplay from './MiniDisplay';
import { calculatorGridWidth, calculatorWidth, ellipsizeText } from './utils';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import { backgroundColor } from '../../theme';

type CalculatorScreenshotDisplayProps = {
  tabId: EntityId,
};

function CalculatorScreenshotDisplay({ tabId }: CalculatorScreenshotDisplayProps) {
  const tabName = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId).name);
  return (
    <Box
      sx={{
        width: calculatorWidth,
        backgroundColor: 'white',
        borderRadius: '5px',
        border: '1px solid black',
        height: 'fit-content',
        alignSelf: 'center',
        paddingTop: '10px',
      }}
    >
      <Stack justifyContent="center">
        <Typography noWrap sx={{ textAlign: 'center' }}>
          { ellipsizeText(tabName, '16px / 24px Roboto, Helvetica, Arial, sans-serif', 250) }
        </Typography>
        <MiniDisplay tabId={tabId} />
      </Stack>
    </Box>
  );
}

/**
 * This component will display all the calculators to be screenshotted in a hidden overlay that's
 * used as a reference to the useScreenshot hook; when the screenshot is taken, the screenshotted
 * node is processed so that the 'display: none' property is removed, and then the image is copied
 * to the clipboard.
 */
function ScreenshotOverlay() {
  const takeScreenshotFlag = useAppSelector(calculatorsSelectors.getTakeScreenshotFlag);
  const tabsOnScreenshot = useAppSelector(calculatorsSelectors.getTabsOnScreenshot);
  const cols = Math.ceil(Math.sqrt(tabsOnScreenshot.length));

  const screenshotRef = useRef(null);
  const [image, takeScreenshot] = useScreenshot({
    type: 'image/png',
    quality: 1.0,
  });

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');

  useEffect(() => {
    if (image === null) return;
    const effect = async () => {
      try {
        const blob = await fetch(image).then((r) => r.blob());
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
      } finally {
        setShowSnackbar(true);
      }
    };
    effect();
  }, [image, takeScreenshotFlag]);

  useEffect(() => {
    const effect = async () => {
      if (takeScreenshotFlag === 0) return;
      if (tabsOnScreenshot.length === 0 || !screenshotRef.current) return;
      // Sleep to make sure the async components load
      // (The icon tint effect only acts on the second render)
      await new Promise((r) => { setTimeout(r, 100); });
      // eslint-disable-next-line no-param-reassign
      takeScreenshot(
        screenshotRef.current,
        { onclone: (_, el) => el.style.setProperty('display', 'block') },
      );
    };
    effect();
  // We ONLY want to fire this when the screenshot flag changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [takeScreenshotFlag]);
  return (
    <>
      <Box
        ref={screenshotRef}
        sx={{
          backgroundColor,
          padding: '25px',
          display: 'none',
          width: calculatorGridWidth(cols, 8, 25),
        }}
      >
        <Grid container columns={cols} spacing={1}>
          {
            tabsOnScreenshot.map((tabId) => (
              <Grid key={tabId}>
                <CalculatorScreenshotDisplay tabId={tabId} />
              </Grid>
            ))
          }
        </Grid>
      </Box>
      <Portal>
        <Snackbar
          open={showSnackbar}
          onClose={() => setShowSnackbar(false)}
          autoHideDuration={6000}
        >
          <Alert
            onClose={() => setShowSnackbar(false)}
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

export default ScreenshotOverlay;
