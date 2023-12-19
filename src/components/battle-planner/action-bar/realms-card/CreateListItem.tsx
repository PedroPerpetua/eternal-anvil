import { useState } from 'react';
import { TwitterPicker } from '@hello-pangea/color-picker';
import ArrowIcon from '@mui/icons-material/ExpandLessSharp';
import {
  Collapse, Paper, Stack, TextField, Typography,
} from '@mui/material';

import { useAppDispatch, useAppSelector } from '../../../../store';
import { CREATE_REALM_ID, realmsTabActions, realmsTabSelectors } from '../../../../store/battle-planner/action-bar/realmsTabSlice';
import { realmsActions } from '../../../../store/battle-planner/battle-map/realmsSlice';
import { DEFAULT_REALM_COLORS } from '../../../../utils/gameData';
import GameButton from '../../../common/styled-components/GameButton';

const DEFAULT_REALM_NAME = '';
const DEFAULT_COLOR = DEFAULT_REALM_COLORS[0];

function CreateListItem() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => realmsTabSelectors.realmIsOpen(state, CREATE_REALM_ID));
  const [realmName, setRealmName] = useState(DEFAULT_REALM_NAME);
  const [color, setColor] = useState(DEFAULT_COLOR);

  const handleCreate = () => {
    dispatch(realmsActions.createRealm({ name: realmName, color }));
    setRealmName(DEFAULT_REALM_NAME);
    setColor(DEFAULT_COLOR);
    dispatch(realmsTabActions.setOpenRealm({ realmId: null }));
  };

  return (
    <Paper sx={{ padding: '5px' }}>
      <Stack
        onClick={() => dispatch(
          realmsTabActions.setOpenRealm({ realmId: isOpen ? null : CREATE_REALM_ID }),
        )}
        className="clickable"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography>Create Realm</Typography>
        </Stack>
        <ArrowIcon
          fontSize="small"
          sx={{
            rotate: isOpen ? '0' : '-180deg',
            transition: 'all',
            transitionDuration: '0.2s',
          }}
        />
      </Stack>
      <Collapse in={isOpen} unmountOnExit>
        <Stack spacing={1} marginTop="10px">
          <TextField
            label="Realm Name"
            value={realmName}
            onChange={(e) => setRealmName(e.target.value)}
            inputProps={{ style: { color: 'black' } }}
          />
          <TwitterPicker
            color={color}
            onChangeComplete={(c) => setColor(c.hex)}
            defaultColor={DEFAULT_COLOR}
            colors={DEFAULT_REALM_COLORS}
            triangle="hide"
            width="100%"
          />
          <GameButton disabled={realmName === '' || color === ''} onClick={handleCreate}>
            Create Realm
          </GameButton>
        </Stack>
      </Collapse>
    </Paper>
  );
}

export default CreateListItem;
