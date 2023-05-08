import { RecoilRoot } from 'recoil';

import BattlePlanner from './components/battle-map/battle-planner/BattlePlanner';
import CustomMapDialog from './components/battle-map/custom-map-dialog/CustomMapDialog';
import TravelWidget
  from './components/travel-simulator/travel-simulator-widget/TravelSimulatorWidget';

function App() {
  return (
    <RecoilRoot>
      <BattlePlanner />
      <CustomMapDialog />
      <TravelWidget />
    </RecoilRoot>
  );
}

export default App;
