import AddStructure from './AddStructure';
import Serializer from './Serializer';
import MapDisplay from '../map-display/MapDisplay';
import TeamDisplay from '../teams/TeamDisplay';

function BattlePlanner() {
  return (
    <>
      <Serializer />
      <MapDisplay />
      <AddStructure />
      <TeamDisplay />
    </>
  );
}

export default BattlePlanner;
