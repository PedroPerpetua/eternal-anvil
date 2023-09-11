import { memo, useState } from 'react';
import { TwitterPicker } from '@hello-pangea/color-picker';
import DeleteIcon from '@mui/icons-material/DeleteForever';
import ArrowIcon from '@mui/icons-material/ExpandLessSharp';
import {
  Button, Collapse, Paper, Popover, Stack,
} from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { shallowEqual } from 'react-redux';

import { useRealmsCardListContext } from './RealmsCardListContext';
import StructureList from './StructureList';
import AddStructureIcon from '../../../../assets/add-structure-icon.png';
import EditIcon from '../../../../assets/edit-icon.png';
import useTintedImage from '../../../../hooks/useTintedImage';
import { useAppDispatch } from '../../../../store';
import { selectRealm } from '../../../../store/battle-planner/action-bar/addStructureTabSlice';
import { changeTab } from '../../../../store/battle-planner/action-bar/currentTabSlice';
import { useBattleMapSelector } from '../../../../store/battle-planner/battle-map';
import { realmSelectors, updateRealm } from '../../../../store/battle-planner/battle-map/realmsSlice';
import { DEFAULT_REALM_COLORS } from '../../../../utils/gameData';
import ColoredAvatar from '../../../common/ColoredAvatar';
import CustomIcon from '../../../common/CustomIcon';
import GameButton from '../../../common/styled-components/GameButton';
import TypographyTextField from '../../../common/TypographyTextField';

type RealmListItemProps = {
  id: EntityId,
  openDelete: () => void,
};

const RealmListItem = memo(({ id, openDelete }: RealmListItemProps) => {
  const dispatch = useAppDispatch();
  const { current, setCurrent } = useRealmsCardListContext();
  const isOpen = current === id;
  const realm = useBattleMapSelector(
    (state) => (realmSelectors.selectById(state.realms, id)),
    shallowEqual,
  );
  const [colorChangeAnchor, setColorChangeAnchor] = useState<HTMLDivElement | null>(null);
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
          <ColoredAvatar
            color={realm.color}
            size={24}
            avatarProps={{
              onClick: (e) => {
                if (!isOpen) return;
                setColorChangeAnchor(e.currentTarget);
                e.stopPropagation();
              },
              sx: {
                ':hover::after': isOpen ? {
                  content: '\'\'',
                  display: 'inline-block',
                  backgroundImage: `url(${EditIcon})`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '85%',
                  width: '85%',
                  height: '85%',
                  top: '7.5%',
                  left: '7.5%',
                  position: 'relative',
                } : {},
              },
            }}
          />
          <Popover
            open={Boolean(colorChangeAnchor)}
            anchorEl={colorChangeAnchor}
            onClose={() => setColorChangeAnchor(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            slotProps={{
              paper: {
                sx: {
                  padding: '5px',
                },
              },
            }}
            // For some reason this propagates to the parent by default
            onClick={(e) => e.stopPropagation()}
          >
            <TwitterPicker
              color={realm.color}
              onChangeComplete={(c) => dispatch(updateRealm({ id, changes: { color: c.hex } }))}
              defaultColor={DEFAULT_REALM_COLORS[0]}
              colors={DEFAULT_REALM_COLORS}
              triangle="hide"
              width="175px"
            />
          </Popover>
          <TypographyTextField
            value={realm.name}
            onChange={(newName) => dispatch(updateRealm({ id, changes: { name: newName } }))}
            editable={isOpen}
            textFieldProps={{
              multiline: true,
              sx: { '& .MuiInputBase-root': { padding: '2px' } },
              inputProps: { style: { color: 'black' } },
              onClick: (e) => { if (isOpen) e.stopPropagation(); },
            }}
            typographyProps={{
              onClick: (e) => { if (isOpen) e.stopPropagation(); },
              sx: { padding: '2px' },
            }}
            editableIconSrc={EditIcon}
          />
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
          <GameButton
            size="small"
            onClick={() => {
              dispatch(selectRealm(realm.id));
              dispatch(changeTab('addStructure'));
            }}
          >
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

export default RealmListItem;
