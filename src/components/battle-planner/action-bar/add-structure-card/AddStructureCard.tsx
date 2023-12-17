import { useEffect, useState } from 'react';
import {
  ListItemIcon, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import AddStructureIcon from '../../../../assets/add-structure-icon.png';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { addStructureTabActions, addStructureTabSelectors } from '../../../../store/battle-planner/action-bar/addStructureTabSlice';
import type { ActionBarTabId } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { realmSelectors } from '../../../../store/battle-planner/battle-map/realmsSlice';
import { createStructure, structuresSelectors } from '../../../../store/battle-planner/battle-map/structuresSlice';
import { STRUCTURES_DATA } from '../../../../utils/gameData';
import type { StructureType } from '../../../../utils/gameData';
import { EMPTY_POINT, validCoordinates } from '../../../../utils/math';
import ColoredAvatar from '../../../common/ColoredAvatar';
import CoordinateInput from '../../../common/CoordinateInput';
import CustomIcon from '../../../common/CustomIcon';
import { GAME_GOLD } from '../../../common/styled-components/colors';
import GameButton from '../../../common/styled-components/GameButton';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';

const TAB_ID: ActionBarTabId = 'addStructure';

const DEFAULT_STRUCTURE_TYPE: StructureType = 'TOWER';

type RealmOptionProps = {
  label: string,
  color: string,
};

function RealmOption({ label, color }: RealmOptionProps) {
  return (
    <Stack direction="row" alignItems="center">
      <ListItemIcon>
        <ColoredAvatar color={color} size={24} />
      </ListItemIcon>
      <Typography variant="inherit" noWrap>
        { label }
      </Typography>
    </Stack>
  );
}

function AddStructureButton() {
  return (
    <ActionBarButton tabId={TAB_ID} tooltip="Add Structure">
      <CustomIcon src={AddStructureIcon} tintColor="#d8bc68" />
    </ActionBarButton>
  );
}

function AddStructureCard() {
  const dispatch = useAppDispatch();
  const realms = useBattleMapSelector(
    (state) => realmSelectors.selectAll(state.realms),
    shallowEqual,
  );
  const occupiedCoordinates = useBattleMapSelector(
    (state) => structuresSelectors.selectAll(state.structures).map((s) => s.coordinates),
    shallowEqual,
  );
  const coordinates = useAppSelector(addStructureTabSelectors.coordinates);
  const selectedRealm = useAppSelector(addStructureTabSelectors.selectedRealm);
  const [structureType, setStructureType] = useState<StructureType>(DEFAULT_STRUCTURE_TYPE);

  useEffect(() => {
    // Make sure the selected realm exists (in case the current selected gets deleted)
    const realmIds = realms.map((r) => r.id);
    // @ts-ignore - includes is not narrow enough; see https://github.com/microsoft/TypeScript/issues/36275
    if (realmIds.includes(selectedRealm)) return;
    if (realms.length === 0) {
      dispatch(addStructureTabActions.setSelectedRealm({ realmId: null }));
      return;
    }
    dispatch(addStructureTabActions.setSelectedRealm({ realmId: realmIds[0] }));
  }, [realms, selectedRealm, dispatch]);

  const canCreate = (
    selectedRealm !== null
    && validCoordinates(coordinates)
    && !occupiedCoordinates.some((p) => p[0] === coordinates[0] && p[1] === coordinates[1])
  );

  const handleCreate = () => {
    if (selectedRealm === null) return;
    dispatch(createStructure({
      realm: selectedRealm,
      coordinates,
      type: structureType,
    }));
    dispatch(addStructureTabActions.setCoordinates(EMPTY_POINT));
  };

  return (
    <ActionBarCard tabId={TAB_ID}>
      <Stack spacing={1}>
        <Typography variant="h6">
          Add Structure
        </Typography>
        <CoordinateInput
          value={coordinates}
          onChange={(v) => dispatch(addStructureTabActions.setCoordinates(v))}
        />
        <TextField
          select
          value={structureType}
          onChange={(e) => setStructureType(e.target.value as StructureType)}
          label="Structure Type"
        >
          { Object.entries(STRUCTURES_DATA).map(([k, data]) => (
            <MenuItem key={k} value={k}>
              { data.name }
            </MenuItem>
          )) }
        </TextField>
        <TextField
          select
          SelectProps={{
            displayEmpty: true,
            // @ts-ignore - There's no way to define the generic type with SelectProps
            renderValue: (value: EntityId | '') => {
              if (realms.length === 0) {
                return (
                  <Typography
                    sx={{
                      color: GAME_GOLD.darker,
                      // We need this for the disabled color
                      WebkitTextFillColor: GAME_GOLD.darker,
                    }}
                  >
                    No realms
                  </Typography>
                );
              }
              const r = realms.find((v) => v.id === value);
              if (!r) return null; // Should never happen
              return <RealmOption label={r.name} color={r.color} />;
            },
          }}
          value={selectedRealm}
          onChange={(e) => dispatch(
            addStructureTabActions.setSelectedRealm({ realmId: e.target.value || null }),
          )}
          label="Realm"
          disabled={realms.length === 0}
          InputLabelProps={{ shrink: true }}
        >
          {
            realms.map((r) => (
              <MenuItem key={r.id} value={r.id} sx={{ display: 'block', maxWidth: '250px' }}>
                <RealmOption label={r.name} color={r.color} />
              </MenuItem>
            ))
          }
        </TextField>
        <GameButton onClick={handleCreate} size="small" disabled={!canCreate}>
          Create Structure
        </GameButton>
      </Stack>
    </ActionBarCard>
  );
}

AddStructureCard.Button = AddStructureButton;

export default AddStructureCard;
