import CalculatorIcon from '@mui/icons-material/Calculate';
import {
  Box, Button, Fab, Modal, Stack, Typography,
} from '@mui/material';
import { shallowEqual } from 'react-redux';

import CalculatorTab from './CalculatorTab';
import { useAppDispatch } from '../../store';
import { useDistanceCalculatorSelector } from '../../store/distance-calculator';
import { createTab, setOpen, tabsSelectors } from '../../store/distance-calculator/tabsSlice';

function DistanceCalculator() {
  const dispatch = useAppDispatch();
  const open = useDistanceCalculatorSelector((state) => state.open);
  const tabIds = useDistanceCalculatorSelector(
    (state) => tabsSelectors.selectIds(state),
    shallowEqual,
  );
  return (
    <>
      <Modal open={open} onClose={() => dispatch(setOpen(false))}>
        <Box className="modal-container" sx={{ padding: 0, width: '300px' }}>
          <Stack direction="row">
            { tabIds.map((id) => <CalculatorTab.Button key={id} tabId={id} />) }
            <Box sx={{ borderBottom: '1px solid black', flex: 1 }}>
              <Button onClick={() => dispatch(createTab())}>New Tab</Button>
            </Box>
          </Stack>
          { tabIds.map((id) => <CalculatorTab key={id} tabId={id} />) }
        </Box>
      </Modal>
      <Fab
        color="primary"
        onClick={() => dispatch(setOpen(true))}
      >
        <CalculatorIcon />
      </Fab>
    </>
  );
}

export default DistanceCalculator;
