import { useEffect, useState } from 'react';
import {
  ListItemIcon, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import AddStructureIcon from '../../../../assets/add-structure-icon.png';
import { useAppDispatch } from '../../../../store';
import useBattleMapSelector from '../../../../store/battleMap';
import { realmSelectors } from '../../../../store/battleMap/realmsSlice';
import { createStructure, structuresSelectors } from '../../../../store/battleMap/structuresSlice';
import { STRUCTURES_DATA, StructureType } from '../../../../utils/gameData';
import { EMPTY_POINT, Point, validCoordinates } from '../../../../utils/math';
import ColoredAvatar from '../../../common/ColoredAvatar';
import CoordinateInput from '../../../common/CoordinateInput';
import { GAME_GOLD } from '../../../common/styled-components/colors';
import GameButton from '../../../common/styled-components/GameButton';
import ActionBarButton from '../ActionBarButton';
import ActionBarCard from '../ActionBarCard';
import { TabId, useActionBarContext } from '../ActionBarContext';

const VALUE: TabId = 'addStructure';

const DEFAULT_COORDINATES: Point = EMPTY_POINT;
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
  return <ActionBarButton value={VALUE} iconSrc={AddStructureIcon} tooltip="Add Structure" />;
}

function AddStructureCard() {
  const { payload: requestedRealm } = useActionBarContext();
  const dispatch = useAppDispatch();
  const realms = useBattleMapSelector(
    (state) => realmSelectors.selectAll(state.realms),
    shallowEqual,
  );
  const occupiedCoordinates = useBattleMapSelector(
    (state) => structuresSelectors.selectAll(state.structures).map((s) => s.coordinates),
    shallowEqual,
  );
  const [realm, setRealm] = useState<EntityId>(realms[0]?.id ?? '');
  const [coordinates, setCoordinates] = useState<Point>(DEFAULT_COORDINATES);
  const [structureType, setStructureType] = useState<StructureType>(DEFAULT_STRUCTURE_TYPE);

  useEffect(() => {
    if (requestedRealm === null) return;
    if (realms.map((r) => r.id).includes(requestedRealm)) setRealm(requestedRealm);
    else setRealm('');
  }, [realms, requestedRealm, setRealm]);

  useEffect(() => {
    // Make sure the selected realm belongs (in case the current selected gets deleted)
    if (realms.length === 0) setRealm('');
    else if (!realms.map((r) => r.id).includes(realm)) setRealm(realms[0].id);
  }, [realms, realm]);

  const canCreate = (
    realm !== ''
    && validCoordinates(coordinates)
    && !occupiedCoordinates.some((p) => p[0] === coordinates[0] && p[1] === coordinates[1])
  );

  const handleCreate = () => {
    dispatch(createStructure({
      realm,
      coordinates,
      type: structureType,
    }));
    setCoordinates(DEFAULT_COORDINATES);
  };

  return (
    <ActionBarCard value={VALUE}>
      <Stack spacing={1}>
        <Typography variant="h6">
          Add Structure
        </Typography>
        <CoordinateInput value={coordinates} onChange={(v) => setCoordinates(v)} />
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
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore - There's no way to define the generic type with SelectProps
            renderValue: (value: EntityId | '') => {
              if (realms.length === 0) {
                return (
                  <Typography
                    sx={{
                      color: GAME_GOLD.darker,
                      WebkitTextFillColor: GAME_GOLD.darker, // We need this for the disabled color
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
          value={realm}
          onChange={(e) => setRealm(e.target.value ?? null)}
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
