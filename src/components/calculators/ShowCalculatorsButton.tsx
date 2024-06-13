import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../store';
import { calculatorsActions } from '../../store/calculators';
import GameButton from '../common/styled/GameButton';

function ShowCalculatorsButton() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  return (
    <GameButton size="large" onClick={() => dispatch(calculatorsActions.setShow(true))}>
      { t('calculators.button') }
    </GameButton>
  );
}

export default ShowCalculatorsButton;
