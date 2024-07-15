import AddIcon from '@mui/icons-material/Add';
import Grid3x3Icon from '@mui/icons-material/Grid3x3';
import MenuIcon from '@mui/icons-material/Menu';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import { useMediaQuery, useTheme } from '@mui/material';
import { useTranslation } from 'react-i18next';

import useCalculatorsDisplayMode from './useCalculatorsDisplayMode';
import { useAppDispatch } from '../../store';
import { calculatorsActions } from '../../store/calculators';
import SpeedDial from '../common/styled/SpeedDial';

function OverlayMenu() {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useAppDispatch();
  const displayMode = useCalculatorsDisplayMode();

  return (
    <SpeedDial IconComponent={MenuIcon}>
      <SpeedDial.MenuButton
        IconComponent={VisibilityOffIcon}
        label={t('calculators.menu.hide')}
        onClick={() => dispatch(calculatorsActions.setShow(false))}
      />
      <SpeedDial.MenuButton
        IconComponent={ShareIcon}
        label={t('calculators.menu.copyImageMultiple')}
        onClick={() => dispatch(calculatorsActions.setShowSelectMultiple(true))}
      />
      {
        !isMobile && (
          <SpeedDial.MenuButton
            IconComponent={displayMode === 'grid' ? WavingHandIcon : Grid3x3Icon}
            // We want the reverse one
            label={t(`calculators.menu.switchMode.${displayMode === 'grid' ? 'free-drag' : 'grid'}`)}
            onClick={() => dispatch(calculatorsActions.setDisplayMode(
              displayMode === 'grid'
                ? 'free-drag'
                : 'grid',
            ))}
          />
        )
      }
      <SpeedDial.MenuButton
        IconComponent={AddIcon}
        label={t('calculators.menu.add')}
        onClick={() => dispatch(calculatorsActions.createCalculator())}
        closeOnClick={false}
      />
    </SpeedDial>
  );
}

export default OverlayMenu;
