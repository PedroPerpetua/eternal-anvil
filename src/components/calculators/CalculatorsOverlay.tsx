import { SortableContext } from '@dnd-kit/sortable';
import { Box, Modal } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Calculator from './Calculator';
import DndProvider from './DndProvider';
import OverlayMenu from './OverlayMenu';
import ScreenshotOverlay from './ScreenshotOverlay';
import SelectForScreenshotModal from './SelectForScreenshotModal';
import useCalculatorsDisplayMode from './useCalculatorsDisplayMode';
import { calculatorGridWidth, calculatorHeight, calculatorSpacing, calculatorWidth } from './utils';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import useElementDimensions from '../common/useElementDimensions';

/**
 * To ensure that, while on the grid, the user can scroll and center the calculator on the screen,
 * we add this artificial offset on both sides
 */
const adjustedOffset = `calc((100dvh - ${calculatorHeight}px) / 2)`;

function CalculatorsOverlay() {
  const dispatch = useAppDispatch();
  const show = useAppSelector(calculatorsSelectors.show);
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);
  const displayMode = useCalculatorsDisplayMode();

  // We fit as many calculators in a row as we can
  const { width, ref: gridRef } = useElementDimensions();
  let numOfCols = 1;
  while (calculatorGridWidth(numOfCols + 1, 8 * calculatorSpacing) < width) {
    numOfCols += 1;
  }

  if (!show) return null;
  return (
    <>
      <DndProvider>
        <Modal open onClose={() => dispatch(calculatorsActions.setShow(false))}>
          { /* This div receives the modal ref and allows using ESX to close */ }
          <div>
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
                  ? (calculatorIds.map((id) => <Calculator key={id} calculatorId={id} />))
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
                        spacing={calculatorSpacing}
                        columns={numOfCols}
                        justifyContent="center"
                        width="100%"
                      >
                        <Grid xs={numOfCols} minHeight={adjustedOffset} />
                        <SortableContext items={calculatorIds}>
                          {
                            calculatorIds.map((id) => (
                              <Grid
                                key={id}
                                display="flex"
                                justifyContent="center"
                                width={calculatorWidth + calculatorSpacing * 8}
                              >
                                <Calculator calculatorId={id} />
                              </Grid>
                            ))
                          }
                        </SortableContext>
                        <Grid xs={numOfCols} minHeight={adjustedOffset} />
                      </Grid>
                    </Box>
                  )
              }
            </Box>
            <OverlayMenu />
          </div>
        </Modal>
      </DndProvider>
      <SelectForScreenshotModal />
      <ScreenshotOverlay />
    </>
  );
}

export default CalculatorsOverlay;
