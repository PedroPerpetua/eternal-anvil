import { Box, Modal, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import Calculator from './Calculator';
import DndProvider from './DndProvider';
import GridOverlayMenu from './GridOverlayMenu';
import ScreenshotOverlay from './ScreenshotOverlay';
import SelectForScreenshotModal from './SelectForScreenshotModal';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';
import useElementDimensions from '../common/useElementDimensions';

type OffsetBoxProps = {
  extraOffset?: number
};

function OffsetBox({ extraOffset = 0 }: OffsetBoxProps) {
  return (<Box sx={{ minHeight: `calc((90vh - 414px) / 2 - ${extraOffset}px)` }} />);
}

function GridOverlay() {
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);

  const { width, ref: gridRef } = useElementDimensions();
  const numOfCols = Math.max(1, Math.floor(width / 310));

  return (
    <DndProvider>
      <Modal open>
        { /* We need to wrap this in another box so that the modal ref doesn't override us */ }
        <Box>
          <Box
            sx={{
              width: '90vw',
              height: '90vh',
              overflowY: calculatorIds.length > numOfCols ? 'auto' : 'hidden',
              overflowX: 'hidden',
              '&::-webkit-scrollbar': { display: 'none' },
            }}
            className="center-screen"
            ref={gridRef}
          >
            <Grid container spacing={1} justifyContent="center" columns={numOfCols}>
              <Grid xs={numOfCols}>
                <OffsetBox extraOffset={-17} />
              </Grid>
              {
                calculatorIds.map((id) => (
                  <Grid xs={1} key={id} display="flex" justifyContent="center">
                    <Calculator key={id} calculatorId={id} />
                  </Grid>
                ))
              }
              <Grid xs={numOfCols}>
                <OffsetBox extraOffset={-18} />
              </Grid>
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
