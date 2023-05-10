import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import { Matrix } from 'transformation-matrix';

import { CustomImageMapInfo } from './useCustomMapStore';
import useRecoilDB from './useRecoilDB';
import { computeAffineMatrix, transformPoint } from '../utils/math';
import {
  StructureMap, Point, HexColor, Id,
} from '../utils/types';
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
  type: keyof StructureMap,
  coordinates: Point,
  team: Id
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const battleMapStore_structures = atom<Map<Id, StructureInfo>>({
  key: 'battleMapStore_structures',
  default: new Map<Id, StructureInfo>(),
});

export type Edge = [Id, Id];

export type EdgeController = {
  selectionMode: boolean,
  selectedStructure: Id | null,
  edges: Array<Edge>,
};

const defaultEdgeController: EdgeController = {
  selectionMode: false,
  selectedStructure: null,
  edges: [],
};

// eslint-disable-next-line @typescript-eslint/naming-convention
const battleMapStore_edgeController = atom<EdgeController>({
  key: 'battleMapStore_edgeController',
  default: defaultEdgeController,
});

function useBattleMapStore() {
  const [mapInfo, setMapInfo] = useRecoilState(battleMapStore_mapInfo);
  const resetMapInfo = useResetRecoilState(battleMapStore_mapInfo);
  const teamsDB = useRecoilDB(battleMapStore_teams);
  const structuresDB = useRecoilDB(battleMapStore_structures);
  const [edgesController, setEdgesController] = useRecoilState(battleMapStore_edgeController);
  const resetEdgesController = useResetRecoilState(battleMapStore_edgeController);

  const reset = () => {
    resetMapInfo();
    teamsDB.resetDB();
    structuresDB.resetDB();
    resetEdgesController();
  };

  const intendedToDisplay = (point: Point) => transformPoint(mapInfo.transformationMatrix, point);

  /* Handle edges ------------------------------------------------------------------------------- */

  const compareEdges = (edge1: Edge, edge2: Edge) => (
    edge1.every((structure) => edge2.includes(structure))
  );

  const toggleSelectionMode = () => {
    setEdgesController({ ...edgesController, selectionMode: !edgesController.selectionMode });
  };

  const selectStructureForEdge = (structureId: Id) => {
    if (!edgesController.selectionMode) return;
    if (structuresDB.getItem(structureId) === null) {
      // Submitted id is invalid.
      return;
    }
    if (
      edgesController.selectedStructure === null
      || structuresDB.getItem(edgesController.selectedStructure) === null
    ) {
      // No valid currently selected edge
      setEdgesController({ ...edgesController, selectedStructure: structureId });
      return;
    }
    const newEdge = [edgesController.selectedStructure, structureId] as [Id, Id];
    if (edgesController.edges.some((edge) => compareEdges(edge, newEdge))) {
      // Edge already exists
      setEdgesController({ ...edgesController, selectedStructure: null, selectionMode: false });
      return;
    }
    setEdgesController({
      selectionMode: false, selectedStructure: null, edges: [...edgesController.edges, newEdge],
    });
  };

  const deleteEdge = (edge: Edge) => {
    const newEdges = [...edgesController.edges].filter((e) => !compareEdges(e, edge));
    setEdgesController({ ...edgesController, edges: newEdges });
  };

  const removeAllEdgesFromStructure = (structureId: Id) => {
    const newEdges = [...edgesController.edges].filter((edge) => edge.includes(structureId));
    setEdgesController({ ...edgesController, edges: newEdges });
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

  const createStructure = (teamId: Id, structureType: keyof StructureMap, coordinates: Point) => {
    const team = teamsDB.getItem(teamId);
    if (!team) return;
    if (structuresDB.asArray().some(
      (struct) => struct.coordinates.every((c, i) => c === coordinates[i]),
    )) return;
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

  /* serialization ------------------------------------------------------------------------------ */

  const serialize = () => JSON.stringify({
    mapInfo,
    teams: teamsDB.toSerialized(),
    structures: structuresDB.toSerialized(),
    edges: edgesController.edges,
  });

  const deserialize = (json: string) => {
    try {
      const info: {
        mapInfo: MapInfo,
        teams: Array<[Id, TeamInfo]>,
        structures: Array<[Id, StructureInfo]>,
        edges: Array<Edge>
      } = JSON.parse(json);
      setMapInfo(info.mapInfo);
      teamsDB.fromSerialized(info.teams);
      structuresDB.fromSerialized(info.structures);
      setEdgesController({ ...defaultEdgeController, edges: info.edges });
    } catch (e) {
      console.error('FAILED TO DESERIALIZE', e);
    }
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
    edgesController,
    toggleSelectionMode,
    selectStructureForEdge,
    deleteEdge,
    // serialization
    serialize,
    deserialize,
  };
}

export default useBattleMapStore;
