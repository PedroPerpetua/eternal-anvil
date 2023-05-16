import AddTeam from './AddTeam';
import TeamCard from './TeamCard';
import useBattleMapStore from '../../../hooks/useBattleMapStore';

function TeamDisplay() {
  const { teams } = useBattleMapStore();
  return (
    <>
      <AddTeam />
      { teams.map((t) => <TeamCard key={t.id} team={t} />) }
    </>
  );
}

export default TeamDisplay;
