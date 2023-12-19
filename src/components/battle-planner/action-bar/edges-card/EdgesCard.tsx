import type { PropsWithChildren } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Badge, ButtonGroup, IconButton, Stack, Typography,
} from '@mui/material';

import EDGE_TOOLS from './EdgeTools';
import type { EdgeToolMode } from './EdgeTools';
import EdgeIcon from '../../../../assets/edge-icon.png';
import { useAppDispatch, useAppSelector } from '../../../../store';
import type { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { edgesTabActions, edgesTabSelectors } from '../../../../store/battle-planner/action-bar/edgesTabSlice';
import { edgesActions, edgesSelectors } from '../../../../store/battle-planner/battle-map/edgesSlice';
import { STRUCTURES_DATA } from '../../../../utils/gameData';
import CustomIcon from '../../../common/CustomIcon';
import GameButton from '../../../common/styled-components/GameButton';
import GildedTooltip from '../../../common/styled-components/GildedTooltip';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const TAB_ID: ActionBarTabId = 'edges';

function EdgesButton() {
  const toolMode = useAppSelector(edgesTabSelectors.toolMode);
  return (
    <ActionBarButton
      tabId={TAB_ID}
      tooltip={(
        <>
          Edges
          <br />
          (
          { EDGE_TOOLS[toolMode].label }
          )
        </>
      )}
    >
      <Badge
        badgeContent={EDGE_TOOLS[toolMode].icon}
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <CustomIcon src={EdgeIcon} tintColor="#d8bc68" />
      </Badge>
    </ActionBarButton>
  );
}

type EdgeToolButtonProps = PropsWithChildren<{
  mode: EdgeToolMode,
  tooltip: string
}>;

function EdgeToolButton({ mode, tooltip, children }: EdgeToolButtonProps) {
  const dispatch = useAppDispatch();
  const toolMode = useAppSelector(edgesTabSelectors.toolMode);
  return (
    <GildedTooltip title={tooltip}>
      <GameButton
        selected={toolMode === mode}
        onClick={() => {
          if (toolMode === mode) return;
          dispatch(edgesTabActions.setToolMode(mode));
          dispatch(edgesActions.deselectStructure());
        }}
      >
        { children }
      </GameButton>
    </GildedTooltip>
  );
}

function EdgesCard() {
  const dispatch = useAppDispatch();
  const toolMode = useAppSelector(edgesTabSelectors.toolMode);
  const structure = useAppSelector(edgesSelectors.currentlySelected);
  return (
    <ActionBarCard tabId={TAB_ID}>
      <Stack spacing={1}>
        <Typography variant="h6">
          Edges
        </Typography>
        <ButtonGroup
          variant="text"
          disableElevation
          sx={{
            '.MuiButtonGroup-grouped:not(:last-of-type)': {
              borderColor: '#023027',
            },
          }}
          fullWidth
        >
          {
            (Object.keys(EDGE_TOOLS) as EdgeToolMode[]).map((edgeToolMode) => (
              <EdgeToolButton
                key={edgeToolMode}
                mode={edgeToolMode}
                tooltip={EDGE_TOOLS[edgeToolMode].label}
              >
                { EDGE_TOOLS[edgeToolMode].icon }
              </EdgeToolButton>
            ))
          }
        </ButtonGroup>
        <Typography textAlign="center">
          {
            (() => {
              if (toolMode !== 'select') return EDGE_TOOLS[toolMode].label;
              return structure
                ? (
                  <>
                    { STRUCTURES_DATA[structure.type].name }
                    { ' ' }
                    (
                    { ' ' }
                    { structure.coordinates[0] }
                    { ' ' }
                    |
                    { ' ' }
                    { structure.coordinates[1] }
                    { ' ' }
                    )
                    <IconButton
                      size="small"
                      onClick={() => dispatch(edgesActions.deselectStructure())}
                    >
                      <CancelIcon color="error" fontSize="inherit" />
                    </IconButton>
                  </>
                ) : 'No structure selected';
            })()
          }
        </Typography>
      </Stack>
    </ActionBarCard>
  );
}

EdgesCard.Button = EdgesButton;

export default EdgesCard;
