import { RecoilRoot } from 'recoil';

import CustomMapDialog from './components/battle-map/custom-map-dialog/CustomMapDialog';
import TravelWidget
  from './components/travel-simulator/travel-simulator-widget/TravelSimulatorWidget';

function App() {
  return (
    <RecoilRoot>
      <CustomMapDialog />
      <TravelWidget />
    </RecoilRoot>
  );
}

export default App;
