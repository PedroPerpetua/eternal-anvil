import {
  Button,
  Card, CardActions, CardContent, TextField, Typography,
} from '@mui/material';

import useBattleMapStore, { TeamInfo } from '../../../hooks/useBattleMapStore';
import { STRUCTURES } from '../../../utils/constants';

type TeamCardProps = {
  team: TeamInfo
};

function TeamCard({ team }: TeamCardProps) {
  const {
    modifyTeam, deleteTeam, structures, deleteStructure,
  } = useBattleMapStore();
  return (
    <Card style={{ backgroundColor: team.color, display: 'inline-block' }}>
      <CardContent>
        <TextField
          value={team.name}
          onChange={(e) => modifyTeam(team.id, { name: e.target.value })}
        />
        {
          structures.filter((s) => s.team === team.id).map((s) => (
            <div key={s.id}>
              <Typography>
                [
                { s.coordinates[0] }
                ,
                { s.coordinates[1] }
                ]
                { STRUCTURES[s.type].name }
              </Typography>
              <Button onClick={() => deleteStructure(s.id)}>Delete Structure</Button>
            </div>
          ))
        }
      </CardContent>
      <CardActions>
        <Button onClick={() => deleteTeam(team.id)}>Delete team</Button>
      </CardActions>
    </Card>
  );
}

export default TeamCard;
