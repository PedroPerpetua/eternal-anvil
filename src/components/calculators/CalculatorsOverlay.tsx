import { SortableContext } from '@dnd-kit/sortable';
import { Box, Modal, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Calculator from './Calculator';
import DndProvider from './DndProvider';
import GridOverlayMenu from './GridOverlayMenu';
import ScreenshotOverlay from './ScreenshotOverlay';
import SelectForScreenshotModal from './SelectForScreenshotModal';
import { calculatorGridWidth, calculatorWidth } from './utils';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import useElementDimensions from '../common/useElementDimensions';

const spacing = 4;
const adjustedOffset = 'calc((100dvh - 417px) / 2)';

function GridOverlay() {
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);

  // We fit as many calculators in a row as we can
  const { width, ref: gridRef } = useElementDimensions();
  let numOfCols = 1;
  while (calculatorGridWidth(numOfCols + 1, 8 * spacing) < width) {
    numOfCols += 1;
  }

  return (
    <DndProvider>
      <Modal open>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100dvh',
            width: '100vw',
            overflowY: 'scroll',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: '100%',
              overflowY: calculatorIds.length > numOfCols ? 'auto' : 'hidden',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': { display: 'none' },
              display: 'flex',
              justifyContent: 'center',
              mask: `linear-gradient(to bottom,
                rgba(0, 0, 0, 0) 0%,
                rgba(0, 0, 0, 0) 10%,
                rgba(0, 0, 0, 1) 15%,
                rgba(0, 0, 0, 1) 90%,
                rgba(0, 0, 0, 0) 95%,
                rgba(0, 0, 0, 0) 100%
              )`,
            }}
            ref={gridRef}
          >
            <Grid
              container
              spacing={spacing}
              columns={numOfCols}
              justifyContent="center"
              width={calculatorGridWidth(numOfCols, spacing * 8)}
            >
              <Grid xs={numOfCols} minHeight={adjustedOffset} />
              <SortableContext items={calculatorIds}>
                {
                  calculatorIds.map((id) => (
                    <Grid
                      key={id}
                      display="flex"
                      justifyContent="center"
                      width={calculatorWidth + spacing * 8}
                    >
                      <Calculator key={id} calculatorId={id} />
                    </Grid>
                  ))
                }
              </SortableContext>
              <Grid xs={numOfCols} minHeight={adjustedOffset} />
            </Grid>
          </Box>
          <GridOverlayMenu />
        </Box>
      </Modal>
    </DndProvider>
  );
}

function CalculatorsOverlay() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const show = useAppSelector(calculatorsSelectors.show);

  if (!show) return null;
  return (
    <>
      { isMobile ? <GridOverlay /> : <GridOverlay /> }
      <SelectForScreenshotModal />
      <ScreenshotOverlay />
    </>
  );
}

export default CalculatorsOverlay;
