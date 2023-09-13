import { PropsWithChildren } from 'react';
import { ButtonGroup, Stack, Typography } from '@mui/material';

import AddEdgeIcon from '../../../../assets/add-edge-icon.png';
import EdgeIcon from '../../../../assets/edge-icon.png';
import ViewIcon from '../../../../assets/view-icon.png';
import useTintedImage from '../../../../hooks/useTintedImage';
import { useAppDispatch } from '../../../../store';
import { useActionBarSelector } from '../../../../store/battle-planner/action-bar';
import { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { EdgeToolMode, changeMode } from '../../../../store/battle-planner/action-bar/edgesTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { structuresSelectors } from '../../../../store/battle-planner/battle-map/structuresSlice';
import CustomIcon from '../../../common/CustomIcon';
import DeleteIcon from '../../../common/styled-components/DeleteIcon';
import GameButton from '../../../common/styled-components/GameButton';
import GildedTooltip from '../../../common/styled-components/GildedTooltip';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const VALUE: ActionBarTabId = 'edges';

function EdgesButton() {
  return <ActionBarButton value={VALUE} iconSrc={EdgeIcon} tooltip="Edges" />;
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
      <GameButton selected={toolMode === mode} onClick={() => dispatch(changeMode(mode))}>
        { children }
      </GameButton>
    </GildedTooltip>
  );
}

function EdgesCard() {
  const addEdgeIcon = useTintedImage(AddEdgeIcon, '#d8bc68');
  const viewIcon = useTintedImage(ViewIcon, '#d8bc68');
  const toolMode = useActionBarSelector((state) => state.edgesTab.toolMode);
  const selectedStructure = useBattleMapSelector((state) => state.edges.currentlySelected);
  const structure = useBattleMapSelector((state) => structuresSelectors.selectById(state.structures, selectedStructure ?? '') ?? null);
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
            aspectRatio: 3.5,
          }}
          fullWidth
        >
          <EdgeToolButton mode="view" tooltip="View mode">
            <CustomIcon src={viewIcon} size="large" />
          </EdgeToolButton>
          <EdgeToolButton mode="select" tooltip="Select mode">
            <CustomIcon src={addEdgeIcon} size="large" />
          </EdgeToolButton>
          <EdgeToolButton mode="delete" tooltip="Delete mode">
            <DeleteIcon color="error" />
          </EdgeToolButton>
        </ButtonGroup>
        {
          toolMode === 'select'
          && (structure
            ? structure.id // TODO CHANGE ME
            : <Typography textAlign="center">No structure selected</Typography>
          )
        }
      </Stack>
    </ActionBarCard>
  );
}

EdgesCard.Button = EdgesButton;

export default EdgesCard;
