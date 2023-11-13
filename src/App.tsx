import BattleMap from './components/battle-planner/battle-map/BattleMap';
import DistanceCalculator from './components/distance-calculator/DistanceCalculator';
import FabBox from './components/website/FabBox';
import WebsiteLayout from './components/website/WebsiteLayout';

function App() {
  return (
    <WebsiteLayout>
      <BattleMap />
      <FabBox>
        <DistanceCalculator />
      </FabBox>
    </WebsiteLayout>
  );
}

export default App;
