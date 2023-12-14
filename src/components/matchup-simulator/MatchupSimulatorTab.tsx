import { memo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
// eslint-disable-next-line import/no-extraneous-dependencies
import { CSS } from '@dnd-kit/utilities';
import { Box, Button, IconButton, Stack } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import WarlordCropper from './WarlordCropper';
import XIcon from '../../assets/x-icon.png';
import { useAppDispatch } from '../../store';
import { useMatchupSimulatorSelector } from '../../store/matchup-simulator';
import {
  deleteTab, openCropper, switchTab, updateTabName, warlordTabsSelectors,
} from '../../store/matchup-simulator/warlordsSlice';
import CustomIcon from '../common/CustomIcon';
import TypographyTextField from '../common/TypographyTextField';

type MatchupSimulatorTabProps = {
  tabId: EntityId
};

export const MatchupSimulatorTabButton = memo(({ tabId }: MatchupSimulatorTabProps) => {
  const dispatch = useAppDispatch();
  const active = useMatchupSimulatorSelector((state) => state.currentTab === tabId);
  const tabName = useMatchupSimulatorSelector((state) => {
    const tab = warlordTabsSelectors.selectById(state.tabs, tabId)!;
    return tab.name ?? '';
  });

  return (
    <Box
      className="clickable center-content"
      onClick={() => dispatch(switchTab(tabId))}
      sx={{
        padding: '2px 10px',
        backgroundColor: 'white',
        height: '100%',
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <TypographyTextField
          value={tabName}
          valueIfEmpty="Matchups"
          onChange={(name) => dispatch(updateTabName({ tabId, name }))}
          doubleClickOnly
          textFieldProps={{ inputProps: { style: { padding: '2px', minWidth: '100px' } } }}
          typographyProps={{ noWrap: true, width: active ? undefined : '100px', minWidth: '100px' }}
        />
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteTab(tabId));
          }}
          color="error"
          sx={{
            borderRadius: '5px',
            backgroundColor: 'red',
            height: '20px',
            width: '20px',
            border: '1px solid darkred',
            ':hover': {
              backgroundColor: 'darkred',
            },
          }}
        >
          <CustomIcon src={XIcon} tintColor="#d8bc68" size={12} />
        </IconButton>
      </Stack>
    </Box>
  );
});

export const DraggableMatchupSimulatorTabButton = memo(({ tabId }: MatchupSimulatorTabProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: tabId });
  const active = useMatchupSimulatorSelector((state) => (state.currentTab === tabId));
  const dragging = useMatchupSimulatorSelector((state) => (state.draggingTab === tabId));

  return (
    <Box
      ref={setNodeRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listeners}
      sx={{
        borderRight: '1px solid black',
        borderBottom: `1px solid ${active ? 'transparent' : 'black'}`,
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: dragging ? 0.5 : undefined,
        pointerEvents: dragging ? 'none' : undefined,
      }}
    >
      <MatchupSimulatorTabButton tabId={tabId} />
    </Box>
  );
});

function MatchupSimulatorTab({ tabId }: MatchupSimulatorTabProps) {
  const dispatch = useAppDispatch();
  const tabData = useMatchupSimulatorSelector(
    (state) => warlordTabsSelectors.selectById(state.tabs, tabId)!,
    shallowEqual,
  );

  return (
    <>
      { tabData.id }
      <Button onClick={() => dispatch(openCropper('attack'))}>open</Button>
      <WarlordCropper />
    </>
  );
}

export default MatchupSimulatorTab;
