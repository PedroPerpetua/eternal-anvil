import {
  DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, useSensor,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import {
  Box, Button, Fab, Modal, Portal, Stack,
} from '@mui/material';
import { shallowEqual } from 'react-redux';

import MatchupSimulatorTab, { DraggableMatchupSimulatorTabButton, MatchupSimulatorTabButton } from './MatchupSimulatorTab';
import { useAppDispatch } from '../../store';
import { useMatchupSimulatorSelector } from '../../store/matchup-simulator';
import { createTab, moveTabEnd, moveTabStart, setShow } from '../../store/matchup-simulator/warlordsSlice';
import useHorizontalScrollerRef from '../common/useHorizontalScrollerRef';

function MatchupSimulator() {
  const dispatch = useAppDispatch();
  const show = useMatchupSimulatorSelector((state) => state.show);
  const tabIds = useMatchupSimulatorSelector((state) => state.orderedTabs, shallowEqual);
  const currentTab = useMatchupSimulatorSelector((state) => state.currentTab);
  const draggingTab = useMatchupSimulatorSelector((state) => state.draggingTab);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const onDragStart = (e: DragStartEvent) => {
    dispatch(moveTabStart(e.active.id.toString()));
  };

  const onDragEnd = (e: DragEndEvent) => {
    dispatch(moveTabEnd({ tabId: e.active.id.toString(), overId: e.over?.id ?? null }));
  };

  const horizontalScrollerRef = useHorizontalScrollerRef();

  return (
    <>
      <Modal open={show} onClose={() => dispatch(setShow(false))}>
        <Box
          sx={{
            width: '90vw',
            height: '90vh',
            backgroundColor: 'white',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '5px',
          }}
        >
          <DndContext
            modifiers={[restrictToHorizontalAxis, restrictToParentElement]}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            sensors={[mouseSensor]}
          >
            <Stack
              direction="row"
              sx={{
                flex: 1,
                overflowX: 'scroll',
                scrollBehavior: 'smooth',
                '&::-webkit-scrollbar': {
                  height: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: '#d8bc68',
                  border: '2px solid transparent',
                  backgroundClip: 'content-box',
                  borderRadius: '5px',
                },
              }}
              ref={horizontalScrollerRef}
            >
              <Stack direction="row">
                <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
                  {
                    tabIds.map((tabId) => (
                      <DraggableMatchupSimulatorTabButton key={tabId} tabId={tabId} />
                    ))
                  }
                  <Portal>
                    <DragOverlay
                      // So it's above the MUI modal
                      zIndex={1301}
                    >
                      { draggingTab && <MatchupSimulatorTabButton tabId={draggingTab} /> }
                    </DragOverlay>
                  </Portal>
                </SortableContext>
              </Stack>
              <Box sx={{ borderBottom: '1px solid black', flex: 1, minWidth: '100px' }}>
                <Button onClick={() => dispatch(createTab())}>New Tab</Button>
              </Box>
            </Stack>
          </DndContext>
          { currentTab && <MatchupSimulatorTab tabId={currentTab} /> }
        </Box>
      </Modal>
      <Fab color="primary" onClick={() => dispatch(setShow(!show))}>
        Hello
      </Fab>
    </>
  );
}

export default MatchupSimulator;
