import { useCallback } from 'react';
import FullScreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import ShareIcon from '@mui/icons-material/Share';
import { Box, Stack } from '@mui/material';
import type { EntityId } from '@reduxjs/toolkit';

import DistanceForm from './DistanceForm';
import MiniDisplay from './MiniDisplay';
import { useTakeScreenshot } from './TakeScreenshotContext';
import XIcon from '../../assets/x-icon.png';
import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors, defaultTabName } from '../../store/calculators';
import type { CalculatorTab as CalculatorTabType } from '../../store/calculators';
import { gameColors } from '../../theme';
import CustomIcon from '../common/CustomIcon';
import MiniIconButton from '../common/styled/MiniIconButton';
import TypographyTextField from '../common/TypographyTextField';

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
  const takeScreenshot = useTakeScreenshot();

  const update = useCallback((changes: Partial<Omit<CalculatorTabType, 'id'>>) => {
    dispatch(calculatorsActions.updateTab({ tabId, changes }));
  }, [dispatch, tabId]);

  return (
    <Box
      className="clickable center-content"
      sx={{
        padding: '2px 10px',
        borderRight: '1px solid black',
        borderBottom: '1px solid',
        borderBottomColor: active ? 'transparent' : 'black',
      }}
      onClick={() => dispatch(calculatorsActions.selectTab({ tabId }))}
    >
      <Stack direction="row" alignItems="center" spacing={1}>
        <TypographyTextField
          value={tab.name}
          onChange={(name) => update({ name })}
          valueIfEmpty={defaultTabName}
          doubleClickOnly
          textFieldProps={{ inputProps: { style: { padding: '2px', minWidth: '100px' } } }}
          typographyProps={{ noWrap: true, width: active ? undefined : '80px', minWidth: '80px' }}
        />
        {
          active && (
            <Stack direction="row" spacing={1}>
              <MiniIconButton
                primary={gameColors.teal.main}
                secondary={gameColors.teal.dark}
                onClick={() => takeScreenshot()}
              >
                <ShareIcon style={{ color: gameColors.goldIcon, fontSize: 16 }} />
              </MiniIconButton>
              <MiniIconButton
                primary={gameColors.teal.main}
                secondary={gameColors.teal.dark}
                onClick={() => update({ mini: !tab.mini })}
              >
                {
                  tab.mini
                    ? (<FullScreenIcon style={{ color: gameColors.goldIcon }} />)
                    : (<FullscreenExitIcon style={{ color: gameColors.goldIcon }} />)
                }
              </MiniIconButton>
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
