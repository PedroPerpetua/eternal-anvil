import { RecoilRoot } from 'recoil';
import TravelWidget
  from './components/travel-simulator-widget/TravelSimulatorWidget';
import CustomMapDialog from './components/custom-map-dialog/CustomMapDialog';


function App() {
  return (
    <RecoilRoot>
      <CustomMapDialog />
      <TravelWidget />
    </RecoilRoot>
  );
}

export default App;
