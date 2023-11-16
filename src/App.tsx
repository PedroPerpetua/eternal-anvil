import BattleMap from './components/battle-planner/battle-map/BattleMap';
import DistanceCalculator from './components/distance-calculator/DistanceCalculator';
import MatchupSimulator from './components/matchup-simulator/MatchupSimulator';
import FabBox from './components/website/FabBox';
import WebsiteLayout from './components/website/WebsiteLayout';

function App() {
  return (
    <WebsiteLayout>
      <BattleMap />
      <FabBox>
        <MatchupSimulator />
        <DistanceCalculator />
      </FabBox>
    </WebsiteLayout>
  );
}

export default App;
