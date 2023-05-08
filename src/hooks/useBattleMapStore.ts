import { useCallback } from 'react';
import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import { Matrix } from 'transformation-matrix';

import { CustomImageMapInfo } from './useCustomMapStore';
import useRecoilDB from './useRecoilDB';
import { Structure } from '../utils/constants';
import { computeAffineMatrix, transformPoint } from '../utils/math';
import { Point, HexColor, Id } from '../utils/types';
import { generateId } from '../utils/utilities';

export type MapInfo = {
  imageMapInfo: CustomImageMapInfo | null,
  transformationMatrix: Matrix
};

// By default, apply a rotation that "mimics" the game (close enough)
const rotationSin = Math.sin(Math.PI / 4);
const scale = 35;
const defaultTransformationMatrix = computeAffineMatrix(
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [scale * rotationSin, scale * rotationSin], [0, scale * 2 * rotationSin]],
);
const defaultMapInfo: MapInfo = {
  imageMapInfo: null,
  transformationMatrix: defaultTransformationMatrix,
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const battleMapStore_mapInfo = atom<MapInfo>({
  key: 'battleMapStore_mapInfo',
  default: defaultMapInfo,
});

export type TeamInfo = {
  readonly id: Id,
  name: string,
  color: HexColor,
  structures: Array<Id>,
};

const defaultTeam: TeamInfo = {
  id: generateId(),
  name: 'Your Realm',
  color: '#115aad',
  structures: [],
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const battleMapStore_teams = atom<Map<Id, TeamInfo>>({
  key: 'battleMapStore_teams',
  default: new Map<Id, TeamInfo>([[defaultTeam.id, defaultTeam]]),
});

export type StructureInfo = {
  readonly id: Id,
  type: Structure,
  coordinates: Point,
  team: Id
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const battleMapStore_structures = atom<Map<Id, StructureInfo>>({
  key: 'battleMapStore_structures',
  default: new Map<Id, StructureInfo>(),
});

export type Edge = [Id, Id];

// eslint-disable-next-line @typescript-eslint/naming-convention
const battleMapStore_hiddenEdges = atom<Array<Edge>>({
  key: 'battleMapStore_hiddenEdges',
  default: [],
});

function useBattleMapStore() {
  const [mapInfo, setMapInfo] = useRecoilState(battleMapStore_mapInfo);
  const resetMapInfo = useResetRecoilState(battleMapStore_mapInfo);
  const teamsDB = useRecoilDB(battleMapStore_teams);
  const structuresDB = useRecoilDB(battleMapStore_structures);
  const [hiddenEdges, setHiddenEdges] = useRecoilState(battleMapStore_hiddenEdges);
  const resetEdges = useResetRecoilState(battleMapStore_hiddenEdges);

  const reset = () => {
    resetMapInfo();
    teamsDB.resetDB();
    structuresDB.resetDB();
    resetEdges();
  };

  const intendedToDisplay = (point: Point) => transformPoint(mapInfo.transformationMatrix, point);

  /* Handle edges ------------------------------------------------------------------------------- */

  const compareEdges = (edge1: Edge, edge2: Edge) => (
    edge1.every((structure) => edge2.includes(structure))
  );

  // eslint-disable-next-line @typescript-eslint/naming-convention, no-underscore-dangle
  const _getEdges = (all = false) => {
    // https://stackoverflow.com/a/22566654/13525157
    const structures = structuresDB.asArray();
    const pairs = structures.map(
      (struct1, i) => structures.slice(i + 1).map((struct2) => [struct1.id, struct2.id] as Edge),
    ).flat();
    if (all) return pairs;
    return pairs.filter((edge) => !hiddenEdges.some((hidden) => compareEdges(hidden, edge)));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getEdges = useCallback(_getEdges, [structuresDB.count(), hiddenEdges.length]);

  const hideEdge = (edge: Edge) => {
    const inHiddenEdges = hiddenEdges.findIndex((hiddenEdge) => compareEdges(hiddenEdge, edge));
    if (inHiddenEdges === -1) setHiddenEdges([...hiddenEdges, edge]);
  };

  const unhideEdge = (edge: Edge) => {
    const newEdges = [...hiddenEdges].filter((hiddenEdge) => !compareEdges(hiddenEdge, edge));
    setHiddenEdges(newEdges);
  };

  const removeAllEdgesFromStructure = (structureId: Id) => {
    const newEdges = [...hiddenEdges].filter((hiddenEdge) => !hiddenEdge.includes(structureId));
    setHiddenEdges(newEdges);
  };

  // Handle teams ------------------------------------------------------------------------------- */
  const getTeam = (id: Id) => teamsDB.getItem(id);

  const createTeam = (name: string, color: HexColor) => {
    teamsDB.createItem({ name, color, structures: [] });
  };

  const modifyTeam = (id: Id, newData: Partial<TeamInfo>) => {
    teamsDB.modifyItem(id, newData);
  };

  const deleteTeam = (id: Id) => {
    teamsDB.deleteItem(id);
  };

  /* Handle structures -------------------------------------------------------------------------- */
  const getStructure = (id: Id) => structuresDB.getItem(id);

  const createStructure = (teamId: Id, structureType: Structure, coordinates: Point) => {
    const team = teamsDB.getItem(teamId);
    if (!team) return;
    const structure = structuresDB.createItem({ type: structureType, coordinates, team: teamId });
    // Add the structure to the team
    modifyTeam(teamId, { structures: [...team.structures, structure.id] });
  };

  const modifyStructure = (id: Id, newData: Partial<StructureInfo>) => {
    structuresDB.modifyItem(id, newData);
  };

  const deleteStructure = (id: Id) => {
    const structure = structuresDB.deleteItem(id);
    if (structure === null) return;
    // Remove the structure from all edges
    removeAllEdgesFromStructure(id);
    // Remove the structure from the team
    const team = teamsDB.getItem(structure.team);
    if (team === null) return;
    modifyTeam(team.id, { structures: team.structures.filter((sId) => sId !== id) });
    // remove
  };

  return {
    reset,
    // customMapInfo
    mapInfo,
    setMapInfo,
    intendedToDisplay,
    // teams
    teams: teamsDB.asArray(),
    getTeam,
    createTeam,
    modifyTeam,
    deleteTeam,
    // structures
    structures: structuresDB.asArray(),
    getStructure,
    createStructure,
    modifyStructure,
    deleteStructure,
    // edges
    getEdges,
    hiddenEdges,
    hideEdge,
    unhideEdge,
  };
}

export default useBattleMapStore;
