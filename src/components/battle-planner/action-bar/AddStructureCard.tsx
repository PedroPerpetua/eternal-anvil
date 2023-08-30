import { useEffect, useState } from 'react';
import {
  ListItemIcon, ListItemText, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId, useActionBarContext } from './ActionBarContext';
import AddStructureIcon from '../../../assets/add-structure-icon.png';
import { useAppDispatch } from '../../../store';
import useBattleMapSelector from '../../../store/battleMap';
import { realmSelectors } from '../../../store/battleMap/realmsSlice';
import { createStructure, structuresSelectors } from '../../../store/battleMap/structuresSlice';
import { NEUTRAL_COLOR, STRUCTURES_DATA, StructureType } from '../../../utils/gameData';
import { EMPTY_POINT, Point, validCoordinates } from '../../../utils/math';
import ColoredAvatar from '../../common/ColoredAvatar';
import CoordinateInput from '../../common/CoordinateInput';
import GameButton from '../../common/styled-components/GameButton';

const VALUE: TabId = 'addStructure';

const DEFAULT_REALM = 'NEUTRAL';
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
      <ListItemText>
        { label }
      </ListItemText>
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
  const [realm, setRealm] = useState<EntityId | typeof DEFAULT_REALM>(DEFAULT_REALM);
  const [coordinates, setCoordinates] = useState<Point>(DEFAULT_COORDINATES);
  const [structureType, setStructureType] = useState<StructureType>(DEFAULT_STRUCTURE_TYPE);

  useEffect(() => {
    if (requestedRealm === null) return;
    if (realms.map((r) => r.id).includes(requestedRealm)) setRealm(requestedRealm);
    else setRealm(DEFAULT_REALM);
  }, [realms, requestedRealm, setRealm]);

  useEffect(() => {
    if (!realms.map((r) => r.id).includes(realm)) setRealm(DEFAULT_REALM);
  }, [realms, realm]);

  const canCreate = (
    validCoordinates(coordinates)
    && !occupiedCoordinates.some((p) => p[0] === coordinates[0] && p[1] === coordinates[1])
  );

  const handleCreate = () => {
    dispatch(createStructure({
      realm: realm === DEFAULT_REALM ? null : realm,
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
          value={realm}
          onChange={(e) => setRealm(e.target.value ?? null)}
          label="Realm"
        >
          <MenuItem value={DEFAULT_REALM}>
            <RealmOption label="Neutral" color={NEUTRAL_COLOR} />
          </MenuItem>
          {
            realms.map((r) => (
              <MenuItem key={r.id} value={r.id}>
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
