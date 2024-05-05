import { useEffect, useRef, useState } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import EditIcon from '@mui/icons-material/Edit';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Stack, TextField, Typography } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import DistanceForm from './DistanceForm';
import MiniDisplay from './MiniDisplay';
import { useTakeScreenshot } from './TakeScreenshotContext';
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
};

function TabButton({ tabId }: TabButtonProps) {
  const dispatch = useAppDispatch();
  const tab = useAppSelector((state) => calculatorsSelectors.getTab(state, tabId));
  const active = useAppSelector((state) => calculatorsSelectors.getTabActive(state, tabId));
  const [editingName, setEditingName] = useState(false);
  const [currName, setCurrName] = useState(tab.name);
  const takeScreenshot = useTakeScreenshot();

  const update = (changes: Partial<Omit<CalculatorTabType, 'id'>>) => {
    dispatch(calculatorsActions.updateTab({ tabId, changes }));
  };

  const handleSaveName = () => {
    const newName = currName.trim();
    if (newName === '') setCurrName(tab.name);
    else if (editingName) {
      setCurrName(newName);
      update({ name: newName });
    }
    setEditingName((curr) => !curr);
  };

  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!active || !scrollRef.current) return;
    scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
  }, [active]);

  return (
    <Box
      className="clickable"
      sx={{
        padding: '2px 10px',
        borderRight: '1px solid black',
        borderBottom: '1px solid',
        borderBottomColor: active ? 'transparent' : 'black',
        display: 'flex',
        flex: 1,
      }}
      onClick={() => dispatch(calculatorsActions.selectTab({ tabId }))}
      ref={scrollRef}
    >
      <Stack
        direction="row"
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        {
          editingName
            ? (
              <TextField
                value={currName}
                onChange={(e) => setCurrName(e.target.value)}
                inputProps={{ style: {
                  padding: '2px',
                  flex: 1,
                  marginBottom: '1px',
                  marginLeft: '-2px',
                  minWidth: '100px',
                } }}
                autoFocus
                onFocus={(e) => e.target.select()}
              />
            )
            : (
              <Typography noWrap sx={{ minWidth: '100px', width: active ? undefined : '100px' }}>
                { tab.name }
              </Typography>
            )
        }
        {
          active && (
            <Stack direction="row" spacing={0.5}>
              <TealMiniIconButton
                Icon={editingName ? DoneIcon : EditIcon}
                onClick={() => handleSaveName()}
                size={editingName ? 24 : undefined}
              />
              <TealMiniIconButton Icon={ShareIcon} onClick={() => takeScreenshot()} />
              <TealMiniIconButton
                Icon={tab.mini ? FullScreenIcon : FullscreenExitIcon}
                size={24}
                onClick={() => update({ mini: !tab.mini })}
              />
              <MiniIconButton
                primary="red"
                secondary="darkred"
                onClick={() => dispatch(calculatorsActions.deleteTab({ tabId }))}
              >
                <CustomIcon src={XIcon} tintColor={gameColors.goldIcon} size={16} />
              </MiniIconButton>
            </Stack>
          )
        }
      </Stack>
    </Box>
  );
}

CalculatorTab.Button = TabButton;

export default CalculatorTab;
