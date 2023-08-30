import { memo, useState } from 'react';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import ArrowIcon from '@mui/icons-material/ExpandLessSharp';
import {
  Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton,
  ListItemIcon, ListItemText, Paper, Stack, Typography,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { useMap } from 'react-leaflet';
import { shallowEqual } from 'react-redux';

import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId, useActionBarContext } from './ActionBarContext';
import AddStructureIcon from '../../../assets/add-structure-icon.png';
import RealmsIcon from '../../../assets/realms-icon.png';
import { useAppDispatch } from '../../../store';
import useBattleMapSelector from '../../../store/battleMap';
import { deleteRealm, realmSelectors } from '../../../store/battleMap/realmsSlice';
import { structuresSelectors } from '../../../store/battleMap/structuresSlice';
import { STRUCTURES_DATA } from '../../../utils/gameData';
import { gameToLeaflet } from '../../../utils/math';
import ColoredAvatar from '../../common/ColoredAvatar';
import CustomIcon from '../../common/CustomIcon';
import GameButton from '../../common/styled-components/GameButton';
import createTabbedContext from '../../common/TabbedContext';

const VALUE: TabId = 'realms';

const {
  useContext: useListContext,
  ContextProvider: ListContextProvider,
} = createTabbedContext<EntityId>();

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

type RealmListItemProps = {
  id: EntityId,
  openDelete: () => void,
};

const RealmListItem = memo(({ id, openDelete }: RealmListItemProps) => {
  const map = useMap();
  const { current, setCurrent } = useListContext();
  const { setCurrent: changeTab } = useActionBarContext();
  const isOpen = current === id;
  const realmData = useBattleMapSelector(
    (state) => {
      const realm = realmSelectors.selectById(state.realms, id);
      if (!realm) return null;
      const structures = structuresSelectors
        .selectAll(state.structures)
        .filter((struct) => struct.realm === realm.id);
      return { ...realm, structures };
    },
    (data1, data2) => {
      if (data1 === null && data2 === null) return true;
      if (data1 === null && data2 !== null) return false;
      if (data1 !== null && data2 === null) return false;
      // Here we know they're both not null; type guard
      if (data1 === null || data2 === null) return false;
      const { structures: data1Structures, ...otherData1 } = data1;
      const { structures: data2Structures, ...otherData2 } = data2;
      return shallowEqual(otherData1, otherData2) && shallowEqual(data1Structures, data2Structures);
    },
  );
  const transformationMatrix = useBattleMapSelector(
    (state) => state.mapInfo.transformationMatrix,
    shallowEqual,
  );
  if (realmData === null) return null;
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
          <ColoredAvatar color={realmData.color} size={24} />
          <Typography>{ realmData.name }</Typography>
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
          <GameButton size="small" onClick={() => changeTab('addStructure', id)}>
            <CustomIcon src={AddStructureIcon} />
          </GameButton>
          <Button size="small" color="error" onClick={openDelete}>
            <DeleteIcon stroke="black" strokeWidth="1px" />
          </Button>
        </Stack>
        {
          realmData.structures.length === 0
            ? (
              <Typography variant="subtitle2" color="gray" textAlign="center">
                No structures
              </Typography>
            )
            : (
              <List dense disablePadding sx={{ marginTop: '5px' }}>
                { realmData.structures.map((s) => (
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
                )) }
              </List>
            )
        }
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
        {
          realmIds.map((id) => (
            <RealmListItem key={id} id={id} openDelete={() => setOpenDeleteDialog(true)} />
          ))
        }
        <RealmDeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} />
      </ListContextProvider>
    </ActionBarCard>
  );
}

RealmsCard.Button = RealmsButton;

export default RealmsCard;
