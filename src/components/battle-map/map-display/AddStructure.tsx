import { useState } from 'react';
import {
  Button, Select, MenuItem, Card, Typography, CardContent, CardActions,
} from '@mui/material';

import useBattleMapStore from '../../../hooks/useBattleMapStore';
import { EMPTY_POINT, Structure } from '../../../utils/constants';
import { Id, Point } from '../../../utils/types';
import CoordinateInput from '../../common/coordinate-input/CoordinateInput';

function AddStructure() {
  const { createStructure, teams } = useBattleMapStore();
  const initialTeamId = teams?.[0].id ?? null;
  const [teamId, setTeamId] = useState<Id | null>(initialTeamId);
  const initialStructure = Structure.TOWER;
  const [structureType, setStructureType] = useState<Structure>(initialStructure);
  const [coordinate, setCoordinate] = useState<Point>(EMPTY_POINT);

  const handleSubmit = () => {
    if (teamId == null) return;
    createStructure(teamId, structureType, coordinate);
  };
  return (
    <Card style={{ backgroundColor: '#8B572A', display: 'inline-block' }}>
      <CardContent>
        <Typography>Team</Typography>
        <Select value={teamId} onChange={(e) => setTeamId(e.target.value as Id)}>
          { teams.map((team) => (
            <MenuItem value={team.id} key={team.id} style={{ backgroundColor: team.color }}>
              { team.name }
              { ' ' }
              (
              { team.id }
              )
            </MenuItem>
          )) }
        </Select>
        <CoordinateInput label="Position" value={coordinate} setValue={setCoordinate} />
      </CardContent>
      <CardActions>
        <Button onClick={handleSubmit}>Add Structure</Button>
      </CardActions>
    </Card>
  );
}

export default AddStructure;
