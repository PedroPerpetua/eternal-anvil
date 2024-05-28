import { SortableContext } from '@dnd-kit/sortable';
import { Box, Modal, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Calculator from './Calculator';
import DndProvider from './DndProvider';
import GridOverlayMenu from './GridOverlayMenu';
import ScreenshotOverlay from './ScreenshotOverlay';
import SelectForScreenshotModal from './SelectForScreenshotModal';
import { calculatorGridWidth } from './utils';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import useElementDimensions from '../common/useElementDimensions';

const adjustedOffset = 'calc((100vh - 417px) / 2)';

function GridOverlay() {
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);

  const { width, ref: gridRef } = useElementDimensions();
  const numOfCols = Math.max(1, Math.floor(width / 310));

  return (
    <DndProvider>
      <Modal open>
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          width: '100vw',
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
              spacing={1}
              columns={numOfCols}
              justifyContent="center"
              width={calculatorGridWidth(numOfCols, 8)}
            >
              <Grid xs={numOfCols} minHeight={adjustedOffset} />
              <SortableContext items={calculatorIds}>
                {
                  calculatorIds.map((id) => (
                    <Grid xs={1} key={id} display="flex" justifyContent="center">
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
