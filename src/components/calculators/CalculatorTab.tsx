import { useEffect, useRef, useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import {
  Box, Menu, MenuItem, Stack, TextField, Typography,
} from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import DistanceForm from './DistanceForm';
import MiniDisplay from './MiniDisplay';
import XIcon from '../../assets/x-icon.png';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import type { CalculatorTab as CalculatorTabType } from '../../store/calculators';
import { gameColors } from '../../theme';
import CustomIcon from '../common/CustomIcon';
import MiniIconButton from '../common/styled/MiniIconButton';
import TealMiniIconButton from '../common/styled/TealMiniIconButton';

type CalculatorTabProps = {
  tabId: EntityId
};

function CalculatorTab({ tabId }: CalculatorTabProps) {
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));
  return tab.mini ? (<MiniDisplay tabId={tabId} />) : (<DistanceForm tabId={tabId} />);
}

type TabButtonProps = {
  tabId: EntityId,
  overlay?: boolean
};

function TabButton({ tabId, overlay = false }: TabButtonProps) {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));
  const active = useAppSelector((state) => calculatorsSelectors.getTabActive(state, tabId));
  const dragging = useAppSelector((state) => calculatorsSelectors.getTabDragging(state, tabId));

  const update = (changes: Partial<Omit<CalculatorTabType, 'id'>>) => {
    dispatch(calculatorsActions.updateTab({ tabId, changes }));
  };

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: tabId });

  const [showMenu, setShowMenu] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const [editingName, setEditingName] = useState(false);
  const [currName, setCurrName] = useState(tab.name);
  const handleSaveName = () => {
    const newName = currName.trim();
    if (newName === '') setCurrName(tab.name);
    else if (editingName) {
      setCurrName(newName);
      update({ name: newName });
    }
    setEditingName((curr) => !curr);
  };

  const scrollRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!active || !scrollRef.current) return;
    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [active]);

  return (
    <>
      <Menu
        open={showMenu}
        onClose={() => setShowMenu(false)}
        anchorEl={anchorRef.current}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ marginLeft: '15px' }}
        disableEnforceFocus
        disableRestoreFocus
      >
        <MenuItem
          disabled={editingName}
          onClick={() => { setShowMenu(false); setEditingName(true); }}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
            <Typography>Edit name</Typography>
            <TealMiniIconButton Icon={EditIcon} />
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowMenu(false);
            dispatch(calculatorsActions.screenshotTab({ tabId }));
          }}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
            <Typography>Copy as image</Typography>
            <TealMiniIconButton Icon={ShareIcon} />
          </Stack>
        </MenuItem>
        <MenuItem onClick={() => { setShowMenu(false); update({ mini: !tab.mini }); }}>
          <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
            <Typography>{ tab.mini ? 'Expand' : 'Minify' }</Typography>
            <TealMiniIconButton Icon={tab.mini ? FullScreenIcon : FullscreenExitIcon} size={24} />
          </Stack>
        </MenuItem>
        <MenuItem
          onClick={() => { setShowMenu(false); dispatch(calculatorsActions.deleteTab({ tabId })); }}
        >
          <Stack direction="row" spacing={2} justifyContent="space-between" width="100%">
            <Typography>Delete Tab</Typography>
            <MiniIconButton primary="red" secondary="red">
              <CustomIcon src={XIcon} tintColor={gameColors.goldIcon} size={16} />
            </MiniIconButton>
          </Stack>
        </MenuItem>
      </Menu>
      <Box
        {...attributes}
        {...listeners}
        ref={(node: HTMLDivElement) => {
          scrollRef.current = node;
          setSortableRef(node);
        }}
        className="clickable"
        sx={{
          backgroundColor: 'white',
          padding: '2px 10px',
          borderRight: overlay ? undefined : '1px solid black',
          borderBottom: (overlay || active) ? undefined : '1px solid black',
          display: 'flex',
          flex: 1,
          height: '100%',
          // Dragging
          transform: CSS.Translate.toString(transform),
          transition,
          opacity: (overlay || !dragging) ? undefined : 0.5,
          pointerEvents: overlay ? 'none' : undefined,
        }}
        onClick={() => dispatch(calculatorsActions.selectTab({ tabId }))}
      >
        <Stack
          direction="row"
          spacing={1}
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          ref={anchorRef}
        >
          {
            editingName
              ? (
                <TextField
                  value={currName}
                  onChange={(e) => setCurrName(e.target.value)}
                  inputProps={{ style: {
                    padding: '2px',
                    marginBottom: '1px',
                    marginLeft: '-2px',
                    minWidth: '80px',
                  } }}
                  sx={{
                    '& fieldset': {
                      marginLeft: '-5px',
                    },
                  }}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
              )
              : (
                <Typography noWrap sx={{ minWidth: '80px', width: active ? undefined : '80px' }}>
                  { tab.name }
                </Typography>
              )
          }
          {
          active && (
            <Stack direction="row" spacing={0.5}>
              {
                editingName && (
                  <TealMiniIconButton Icon={DoneIcon} onClick={() => handleSaveName()} />
                )
              }
              <TealMiniIconButton Icon={MenuIcon} onClick={() => setShowMenu(true)} size={18} />
            </Stack>
          )
        }
        </Stack>
      </Box>
    </>
  );
}

CalculatorTab.Button = TabButton;

export default CalculatorTab;
