import AddStructure from './AddStructure';
import AddTeam from './AddTeam';
import Serializer from './Serializer';
import MapDisplay from '../map-display/MapDisplay';

function BattlePlanner() {
  return (
    <>
      <Serializer />
      <MapDisplay />
      <AddStructure />
      <AddTeam />
    </>
  );
}

export default BattlePlanner;
