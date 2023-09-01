import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId } from './ActionBarContext';
import MapIcon from '../../../assets/map-icon.png';

const VALUE: TabId = 'map';

function MapButton() {
  return <ActionBarButton value={VALUE} iconSrc={MapIcon} tooltip="Map" />;
}

function MapCard() {
  return (
    <ActionBarCard value={VALUE}>
      Map
    </ActionBarCard>
  );
}

MapCard.Button = MapButton;

export default MapCard;
