import { memo, useState } from 'react';
import { TwitterPicker } from '@hello-pangea/color-picker';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import ArrowIcon from '@mui/icons-material/ExpandLessSharp';
import {
  Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton,
  ListItemIcon, ListItemText, Paper, Stack, TextField, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { useMap } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId, useActionBarContext } from './ActionBarContext';
import AddStructureIcon from '../../../assets/add-structure-icon.png';
import RealmsIcon from '../../../assets/realms-icon.png';
import useTintedImage from '../../../hooks/useTintedImage';
import { useAppDispatch } from '../../../store';
import useBattleMapSelector from '../../../store/battleMap';
import { createRealm, deleteRealm, realmSelectors } from '../../../store/battleMap/realmsSlice';
import { structuresSelectors } from '../../../store/battleMap/structuresSlice';
import { DEFAULT_REALM_COLORS, STRUCTURES_DATA } from '../../../utils/gameData';
import { gameToLeaflet } from '../../../utils/math';
import ColoredAvatar from '../../common/ColoredAvatar';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled-components/GameButton';
import createTabbedContext from '../../common/TabbedContext';

const VALUE: TabId = 'realms';

const DEFAULT_REALM_NAME = '';
const DEFAULT_COLOR = DEFAULT_REALM_COLORS[0];

const {
  useContext: useListContext,
  ContextProvider: ListContextProvider,
} = createTabbedContext<EntityId | 'CREATE'>();

function RealmCreateListItem() {
  const dispatch = useAppDispatch();
  const { current, setCurrent } = useListContext();
  const isOpen = current === 'CREATE';
  const [realmName, setRealmName] = useState(DEFAULT_REALM_NAME);
  const [color, setColor] = useState(DEFAULT_COLOR);

  const handleCreate = () => {
    dispatch(createRealm({ name: realmName, color }));
    setRealmName(DEFAULT_REALM_NAME);
    setColor(DEFAULT_COLOR);
    setCurrent(null);
  };

  return (
    <Paper sx={{ padding: '5px' }}>
      <Stack
        onClick={() => setCurrent(isOpen ? null : 'CREATE')}
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

type RealmDeleteDialogProps = {
  open: boolean,
  onClose: () => void
};

function RealmDeleteDialog({ open, onClose }: RealmDeleteDialogProps) {
  const { current } = useListContext();
  const dispatch = useAppDispatch();
  const realmName = useBattleMapSelector((state) => {
    if (current === null) return null;
    const realm = realmSelectors.selectById(state.realms, current);
    return realm?.name ?? null;
  });
  if (realmName === null) return null;
  const handleDelete = () => {
    if (current) dispatch(deleteRealm(current));
    onClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Are you sure you want to delete realm &quot;
        { realmName }
        &quot;?
      </DialogTitle>
      <DialogContent>
        This will also delete all associated structures and edges.
      </DialogContent>
      <DialogActions>
        <Button variant="text" autoFocus onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={handleDelete}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
}

type StructureListProps = {
  realmId: EntityId | null
};

const StructureList = memo(({ realmId }: StructureListProps) => {
  const map = useMap();
  const structures = useBattleMapSelector(
    (state) => structuresSelectors.selectAll(state.structures).filter((s) => s.realm === realmId),
    shallowEqual,
  );
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  if (structures.length === 0) {
    return (
      <Typography variant="subtitle2" color="gray" textAlign="center">
        No structures
      </Typography>
    );
  }
  return (
    <List dense disablePadding sx={{ marginTop: '5px' }}>
      {
        structures.map((s) => (
          <ListItemButton
            key={s.id}
            onClick={() => map.setView(gameToLeaflet(transformationMatrix, s.coordinates))}
          >
            <ListItemIcon>
              <CustomIcon src={STRUCTURES_DATA[s.type].icon} />
            </ListItemIcon>
            <ListItemText>
              { STRUCTURES_DATA[s.type].name }
              { ' ' }
              (
              { s.coordinates[0] }
              |
              { s.coordinates[1] }
              )
            </ListItemText>
          </ListItemButton>
        ))
      }
    </List>
  );
});

type RealmListItemProps = {
  id: EntityId,
  openDelete: () => void,
};

const RealmListItem = memo(({ id, openDelete }: RealmListItemProps) => {
  const { current, setCurrent } = useListContext();
  const { setCurrent: changeTab } = useActionBarContext();
  const isOpen = current === id;
  const realm = useBattleMapSelector(
    (state) => (realmSelectors.selectById(state.realms, id)),
    shallowEqual,
  );
  const tintedAddStructureIcon = useTintedImage(AddStructureIcon, '#d8bc68');
  if (!realm) return null;
  return (
    <Paper sx={{ padding: '5px' }}>
      <Stack
        onClick={() => setCurrent(isOpen ? null : id)}
        className="clickable"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <ColoredAvatar color={realm.color} size={24} />
          <Typography>{ realm.name }</Typography>
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
        <Stack direction="row" justifyContent="center" padding="5px" spacing={2}>
          <GameButton size="small" onClick={() => changeTab('addStructure', realm.id)}>
            <CustomIcon src={tintedAddStructureIcon} />
          </GameButton>
          <Button size="small" color="error" onClick={openDelete}>
            <DeleteIcon stroke="black" strokeWidth="1px" />
          </Button>
        </Stack>
        <StructureList realmId={realm.id} />
      </Collapse>
    </Paper>
  );
});

function RealmsButton() {
  return <ActionBarButton value={VALUE} iconSrc={RealmsIcon} tooltip="Realms" />;
}

function RealmsCard() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const realmIds = useBattleMapSelector(
    (state) => realmSelectors.selectIds(state.realms),
    shallowEqual,
  );
  return (
    <ActionBarCard value={VALUE}>
      <Typography variant="h6">
        Realms
      </Typography>
      <ListContextProvider>
        <Stack spacing={1}>
          {
            realmIds.map((id) => (
              <RealmListItem key={id} id={id} openDelete={() => setOpenDeleteDialog(true)} />
            ))
          }
          <RealmCreateListItem />
        </Stack>
        <RealmDeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} />
      </ListContextProvider>
    </ActionBarCard>
  );
}

RealmsCard.Button = RealmsButton;

export default RealmsCard;
