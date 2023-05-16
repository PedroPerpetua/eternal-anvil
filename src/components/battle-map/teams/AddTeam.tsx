import { useState } from 'react';
import { SketchPicker } from '@hello-pangea/color-picker';
import {
  Button, Card, CardActions, CardContent, TextField, Typography,
} from '@mui/material';

import useBattleMapStore from '../../../hooks/useBattleMapStore';
import { REALM_COLORS } from '../../../utils/constants';
import { HexColor } from '../../../utils/types';

function AddTeam() {
  const [name, setName] = useState('');
  const [color, setColor] = useState<HexColor>('#000000');
  const { createTeam } = useBattleMapStore();

  const handleClick = () => {
    createTeam(name, color);
    setName('');
    setColor('#000000');
  };

  return (
    <Card style={{ backgroundColor: 'brown', display: 'inline-block' }}>
      <CardContent>
        <Typography style={{ margin: '5px' }}>Team Name</Typography>
        <TextField
          style={{ margin: '5px' }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <SketchPicker
          color={color}
          onChange={(c) => setColor(c.hex as HexColor)}
          disableAlpha
          presetColors={REALM_COLORS}
        />
      </CardContent>
      <CardActions>
        <Button onClick={handleClick}>Add Team</Button>
      </CardActions>
    </Card>
  );
}

export default AddTeam;
