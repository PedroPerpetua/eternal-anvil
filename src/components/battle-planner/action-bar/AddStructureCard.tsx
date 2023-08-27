import { useState } from 'react';
import {
  Avatar, Button, ListItemIcon, ListItemText, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId } from './ActionBarContext';
import AddStructureIcon from '../../../assets/add-structure-icon.png';
import { useAppDispatch, useAppSelector } from '../../../store';
import { realmSelectors } from '../../../store/realmsSlice';
import { createStructure, structuresSelectors } from '../../../store/structuresSlice';
import { NEUTRAL_COLOR, STRUCTURES_DATA, StructureType } from '../../../utils/gameData';
import { EMPTY_POINT, Point, validCoordinates } from '../../../utils/math';
import CoordinateInput from '../../common/CoordinateInput';

const VALUE: TabId = 'addStructure';

const DEFAULT_REALM = 'NEUTRAL';
const DEFAULT_COORDINATES: Point = EMPTY_POINT;
const DEFAULT_STRUCTURE_TYPE: StructureType = 'TOWER';

function AddStructureButton() {
  return <ActionBarButton value={VALUE} iconSrc={AddStructureIcon} tooltip="Add Structure" />;
}

function AddStructureCard() {
  const dispatch = useAppDispatch();
  const realms = useAppSelector((state) => realmSelectors.selectAll(state.realms), shallowEqual);
  const occupiedCoordinates = useAppSelector(
    (state) => structuresSelectors.selectAll(state.structures).map((s) => s.coordinates),
    shallowEqual,
  );
  const [realm, setRealm] = useState<EntityId | ''>(DEFAULT_REALM);
  const [coordinates, setCoordinates] = useState<Point>(DEFAULT_COORDINATES);
  const [structureType, setStructureType] = useState<StructureType>(DEFAULT_STRUCTURE_TYPE);

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
          Add Structrure
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
            <ListItemIcon>
              <Avatar sx={{ backgroundColor: NEUTRAL_COLOR, width: '24px', height: '24px' }}>
                { /* Fallback so the avatar comes out empty (just color) */ }
                { ' ' }
              </Avatar>
            </ListItemIcon>
            <ListItemText>
              Neutral
            </ListItemText>
          </MenuItem>
          { realms.map((r) => (
            <MenuItem key={r.id} value={r.id}>
              <ListItemIcon>
                <Avatar sx={{ backgroundColor: r.color, width: '24px', height: '24px' }}>
                  { /* Fallback so the avatar comes out empty (just color) */ }
                  { ' ' }
                </Avatar>
              </ListItemIcon>
              <ListItemText>
                { r.name }
              </ListItemText>
            </MenuItem>
          )) }
        </TextField>
        <Button onClick={handleCreate} size="small" disabled={!canCreate}>
          Create Structure
        </Button>
      </Stack>
    </ActionBarCard>
  );
}

AddStructureCard.Button = AddStructureButton;

export default AddStructureCard;
