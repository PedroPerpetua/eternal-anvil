import { useRef, useState } from 'react';
import { Box, Modal, useMediaQuery, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import useResizeObserver from '@react-hook/resize-observer';

import Calculator from './Calculator';
import MobileMenu from './MobileMenu';
import { useAppSelector } from '../../store';
import { calculatorsSelectors } from '../../store/calculators';

type OffsetBoxProps = {
  extraOffset?: number
};

function OffsetBox({ extraOffset = 0 }: OffsetBoxProps) {
  return (<Box sx={{ minHeight: `calc((90vh - 414px) / 2 - ${extraOffset}px)` }} />);
}

function MobileCalculators() {
  const calculatorIds = useAppSelector(calculatorsSelectors.getCalculatorIds);

  const gridRef = useRef<HTMLElement>(null);
  const [numOfCols, setNumOfCols] = useState(1);
  useResizeObserver(
    gridRef,
    (res) => setNumOfCols(Math.max(1, Math.floor(res.contentRect.width / 310))),
  );

  return (
    <Modal open>
      { /* We need to wrap this in another box so that the modal ref doesn't override us */ }
      <Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '90vh',
            overflow: 'auto',
            '&::-webkit-scrollbar': { display: 'none' },
          }}
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
        <MobileMenu />
      </Box>
    </Modal>
  );
}

function CalculatorsOverlay() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const show = useAppSelector(calculatorsSelectors.show);

  if (!show) return null;
  return isMobile ? <MobileCalculators /> : <MobileCalculators />;
}

export default CalculatorsOverlay;
