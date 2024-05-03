import { useAppDispatch, useAppSelector } from '../../store';
import { calculatorsActions, calculatorsSelectors } from '../../store/calculators';
import GameButton from '../common/styled/GameButton';

function ShowCalculatorsButton() {
  const dispatch = useAppDispatch();
  const show = useAppSelector(calculatorsSelectors.show);
  return (
    <GameButton size="large" onClick={() => dispatch(calculatorsActions.setShow(!show))}>
      { show ? 'Hide' : 'Show' }
      { ' ' }
      calculators
    </GameButton>
  );
}

export default ShowCalculatorsButton;
