import { SortableContext } from '@dnd-kit/sortable';
import { Box, Modal } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Calculator from './Calculator';
import DndProvider from './DndProvider';
import OverlayMenu from './OverlayMenu';
import ScreenshotOverlay from './ScreenshotOverlay';
import SelectForScreenshotModal from './SelectForScreenshotModal';
import useCalculatorsDisplayMode from './useCalculatorsDisplayMode';
import { calculatorGridWidth, calculatorWidth } from './utils';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import useElementDimensions from '../common/useElementDimensions';

const spacing = 4;
const adjustedOffset = 'calc((100dvh - 417px) / 2)';

function CalculatorsOverlay() {
  const show = useAppSelector(calculatorsSelectors.show);
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);
  const displayMode = useCalculatorsDisplayMode();

  // We fit as many calculators in a row as we can
  const { width, ref: gridRef } = useElementDimensions();
  let numOfCols = 1;
  while (calculatorGridWidth(numOfCols + 1, 8 * spacing) < width) {
    numOfCols += 1;
  }

  const calculatorElements = calculatorIds.map((id) => (
    <Grid
      key={id}
      display="flex"
      justifyContent="center"
      width={calculatorWidth + spacing * 8}
    >
      <Calculator key={id} calculatorId={id} />
    </Grid>
  ));

  if (!show) return null;
  return (
    <>
      <DndProvider>
        <Modal open>
          <>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100dvh',
                width: '100vw',
                overflowY: 'scroll',
                '&::-webkit-scrollbar': { display: 'none' },
                mask: `linear-gradient(to bottom,
                  rgba(0, 0, 0, 0) 0%,
                  rgba(0, 0, 0, 0) 10%,
                  rgba(0, 0, 0, 1) 15%,
                  rgba(0, 0, 0, 1) 90%,
                  rgba(0, 0, 0, 0) 95%,
                  rgba(0, 0, 0, 0) 100%
                )`,
              }}
            >
              {
                displayMode === 'free-drag'
                  ? (calculatorElements)
                  : (
                    <Box
                      sx={{
                        width: '100%',
                        height: '100%',
                        overflowY: calculatorIds.length > numOfCols ? 'auto' : 'hidden',
                        overflowX: 'hidden',
                        '&::-webkit-scrollbar': { display: 'none' },
                        display: 'flex',
                        justifyContent: 'center',
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
                          { calculatorElements }
                        </SortableContext>
                        <Grid xs={numOfCols} minHeight={adjustedOffset} />
                      </Grid>
                    </Box>
                  )
              }
            </Box>
            <OverlayMenu />
          </>
        </Modal>
      </DndProvider>
      <SelectForScreenshotModal />
      <ScreenshotOverlay />
    </>
  );
}

export default CalculatorsOverlay;
