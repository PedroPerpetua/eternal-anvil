import CalculatorIcon from '@mui/icons-material/Calculate';
import ToolIcon from '@mui/icons-material/Construction';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../store';
import { calculatorsActions } from '../../store/calculators';
import SpeedDial from '../common/styled/SpeedDial';

function Tools() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <SpeedDial IconComponent={ToolIcon}>
      <SpeedDial.MenuButton
        IconComponent={CalculatorIcon}
        label={t('calculators.button')}
        onClick={() => dispatch(calculatorsActions.setShow(true))}
      />
    </SpeedDial>
  );
}

export default Tools;
