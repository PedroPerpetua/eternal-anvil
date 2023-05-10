import { useState } from 'react';
import {
  Button, Select, MenuItem, Card, Typography, CardContent, CardActions,
} from '@mui/material';

import useBattleMapStore from '../../../hooks/useBattleMapStore';
import { EMPTY_POINT, STRUCTURES } from '../../../utils/constants';
import { Id, Point, StructureMap } from '../../../utils/types';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';

function AddStructure() {
  const {
    createStructure, teams, edgesController, toggleSelectionMode,
  } = useBattleMapStore();
  const initialTeamId = teams?.[0].id ?? null;
  const [teamId, setTeamId] = useState<Id | null>(initialTeamId);
  const initialStructure: keyof StructureMap = 'TOWER';
  const [structureType, setStructureType] = useState<keyof StructureMap>(initialStructure);
  const [coordinate, setCoordinate] = useState<Point>(EMPTY_POINT);

  const handleSubmit = () => {
    if (teamId == null) return;
    createStructure(teamId, structureType, coordinate);
  };

  const handleSelection = () => {
    toggleSelectionMode();
  };

  return (
    <Card style={{ backgroundColor: '#8B572A', display: 'inline-block' }}>
      <CardContent>
        <Typography>Team</Typography>
        <Select value={teamId} onChange={(e) => setTeamId(e.target.value as Id)}>
          { teams.map((team) => (
            <MenuItem value={team.id} key={team.id} style={{ backgroundColor: team.color }}>
              { team.name }
            </MenuItem>
          )) }
        </Select>
        <Select
          value={structureType}
          onChange={(e) => setStructureType(e.target.value as keyof StructureMap)}
        >
          {
            Object.entries(STRUCTURES).map(([key, structure]) => (
              <MenuItem value={key} key={key}>{ structure.name }</MenuItem>
            ))
          }
        </Select>
        <CoordinateInput label="Position" value={coordinate} setValue={setCoordinate} />
      </CardContent>
      <CardActions>
        <Button onClick={handleSubmit}>Add Structure</Button>
        <Button onClick={handleSelection}>
          Create Edge
          { ' ' }
          { edgesController.selectionMode ? 'ACTIVE' : 'INACTIVE' }
        </Button>
      </CardActions>
    </Card>
  );
}

export default AddStructure;
