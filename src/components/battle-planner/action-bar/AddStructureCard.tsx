import { useState } from 'react';
import {
  Button, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId } from './ActionBarContext';
import AddStructureIcon from '../../../assets/add-structure-icon.png';
import { useAppDispatch, useAppSelector } from '../../../store';
import { realmSelectors } from '../../../store/realmsSlice';
import { createStructure } from '../../../store/structuresSlice';
import { STRUCTURES_DATA, StructureType } from '../../../utils/gameData';
import { EMPTY_POINT, Point } from '../../../utils/math';
import CoordinateInput from '../../common/CoordinateInput';

const VALUE: TabId = 'addStructure';

const DEFAULT_REALM = 'NEUTRAL';
const DEFAULT_COORDINATES: Point = EMPTY_POINT;
const DEFAULT_STRUCTURE_TYPE: StructureType = 'TOWER';

function AddStructureButton() {
  return <ActionBarButton value={VALUE} iconSrc={AddStructureIcon} />;
}

function AddStructureCard() {
  const dispatch = useAppDispatch();
  const realms = useAppSelector((state) => realmSelectors.selectAll(state.realms), shallowEqual);
  const [realm, setRealm] = useState<EntityId | ''>(DEFAULT_REALM);
  const [coordinates, setCoordinates] = useState<Point>(DEFAULT_COORDINATES);
  const [structureType, setStructureType] = useState<StructureType>(DEFAULT_STRUCTURE_TYPE);

  const handleCreate = () => {
    dispatch(createStructure({
      realm: realm === DEFAULT_REALM ? null : realm,
      coordinates,
      type: structureType,
    }));
    setRealm(DEFAULT_REALM);
    setCoordinates(DEFAULT_COORDINATES);
    setStructureType(DEFAULT_STRUCTURE_TYPE);
  };

  return (
    <ActionBarCard value={VALUE}>
      <Stack spacing={1}>
        <Typography variant="h6">
          Add Structrure
        </Typography>
        <TextField
          select
          value={realm}
          onChange={(e) => setRealm(e.target.value ?? null)}
          label="Realm"
        >
          <MenuItem value={DEFAULT_REALM}>Neutral</MenuItem>
          { realms.map((r) => (
            <MenuItem key={r.id} value={r.id} sx={{ backgroundColor: r.color }}>
              { r.name }
            </MenuItem>
          )) }
        </TextField>
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
        <Button onClick={handleCreate}>
          Create Structure
        </Button>
      </Stack>
    </ActionBarCard>
  );
}

AddStructureCard.Button = AddStructureButton;

export default AddStructureCard;
