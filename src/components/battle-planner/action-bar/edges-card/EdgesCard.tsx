import { PropsWithChildren } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Badge, ButtonGroup, IconButton, Stack, Typography,
} from '@mui/material';
import { shallowEqual } from 'react-redux';

import EDGE_TOOLS from './EdgeTools';
import EdgeIcon from '../../../../assets/edge-icon.png';
import { useAppDispatch } from '../../../../store';
import { useActionBarSelector } from '../../../../store/battle-planner/action-bar';
import { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { EdgeToolMode, changeMode } from '../../../../store/battle-planner/action-bar/edgesTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { deselectStructure } from '../../../../store/battle-planner/battle-map/edgesSlice';
import { structuresSelectors } from '../../../../store/battle-planner/battle-map/structuresSlice';
import { STRUCTURES_DATA } from '../../../../utils/gameData';
import CustomIcon from '../../../common/CustomIcon';
import GameButton from '../../../common/styled-components/GameButton';
import GildedTooltip from '../../../common/styled-components/GildedTooltip';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const VALUE: ActionBarTabId = 'edges';

function EdgesButton() {
  const toolMode = useActionBarSelector((state) => state.edgesTab.toolMode);
  return (
    <ActionBarButton
      value={VALUE}
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
  const toolMode = useActionBarSelector((state) => state.edgesTab.toolMode);
  return (
    <GildedTooltip title={tooltip}>
      <GameButton
        selected={toolMode === mode}
        onClick={() => {
          dispatch(changeMode(mode));
          dispatch(deselectStructure());
        }}
      >
        { children }
      </GameButton>
    </GildedTooltip>
  );
}

function EdgesCard() {
  const dispatch = useAppDispatch();
  const toolMode = useActionBarSelector((state) => state.edgesTab.toolMode);
  const selectedStructure = useBattleMapSelector((state) => state.edges.currentlySelected);
  const structure = useBattleMapSelector(
    (state) => structuresSelectors.selectById(state.structures, selectedStructure ?? '') ?? null,
    shallowEqual,
  );
  return (
    <ActionBarCard value={VALUE}>
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
        {
          toolMode === 'select'
            ? (
              <Typography textAlign="center">
                {
                structure
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
                      <IconButton size="small" onClick={() => dispatch(deselectStructure())}>
                        <CancelIcon color="error" fontSize="inherit" />
                      </IconButton>
                    </>
                  )
                  : 'No structure selected'
                }
              </Typography>
            )
            : <Typography textAlign="center">{ EDGE_TOOLS[toolMode].label }</Typography>
        }
      </Stack>
    </ActionBarCard>
  );
}

EdgesCard.Button = EdgesButton;

export default EdgesCard;
