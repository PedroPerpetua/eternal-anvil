import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId } from './ActionBarContext';
import RealmsIcon from '../../../assets/realms-icon.png';

const VALUE: TabId = 'realms';

function RealmsButton() {
  return <ActionBarButton value={VALUE} iconSrc={RealmsIcon} tooltip="Realms" />;
}

function RealmsCard() {
  return (
    <ActionBarCard value={VALUE}>
      Realms
    </ActionBarCard>
  );
}

RealmsCard.Button = RealmsButton;

export default RealmsCard;
