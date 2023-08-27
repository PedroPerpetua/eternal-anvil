import ActionBarButton from './ActionBarButton';
import ActionBarCard from './ActionBarCard';
import { TabId } from './ActionBarContext';
import SettingsIcon from '../../../assets/settings-icon.png';

const VALUE: TabId = 'settings';

function SettingsButton() {
  return <ActionBarButton value={VALUE} iconSrc={SettingsIcon} />;
}

function SettingsCard() {
  return (
    <ActionBarCard value={VALUE}>
      Settings
    </ActionBarCard>
  );
}

SettingsCard.Button = SettingsButton;

export default SettingsCard;
