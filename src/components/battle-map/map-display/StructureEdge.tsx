import { useState } from 'react';
import { DivIcon } from 'leaflet';
import { Marker, Polyline } from 'react-leaflet';

import useBattleMapStore, { Edge } from '../../../hooks/useBattleMapStore';
import { DISTANCE_PENALTIES } from '../../../utils/constants';
import { shadeColor } from '../../../utils/cssTintFilter';
import { calcDistance, halfway } from '../../../utils/math';
import { HexColor } from '../../../utils/types';

type StructureEdgeProps = {
  edge: Edge
};

function StructureEdge({ edge }: StructureEdgeProps) {
  const {
    getStructure, intendedToDisplay, hideEdge, getTeam,
  } = useBattleMapStore();
  const [hovering, setHovering] = useState(false);
  const structure1 = getStructure(edge[0]);
  const structure2 = getStructure(edge[1]);
  if (structure1 === null || structure2 === null) return null;
  const team1 = getTeam(structure1?.team);
  const team2 = getTeam(structure2.team);
  if (team1 === null || team2 === null) return null;

  let color = '#000000' as HexColor;
  let distance = 0;
  if (team1.id === team2.id) {
    // Same team
    color = team1.color;
    distance = calcDistance(
      structure1.coordinates,
      structure2.coordinates,
      DISTANCE_PENALTIES.SUPPORT.penalty,
    );
  }

  const eventHandlers = {
    click: () => hideEdge(edge),
    mouseover: () => setHovering(true),
    mouseout: () => setHovering(false),
  };

  return (
    <>
      {
        hovering && (
          <Marker
            icon={new DivIcon({ html: `<h1>${distance.toFixed(2)}</h1>` })}
            position={intendedToDisplay(halfway(structure1.coordinates, structure2.coordinates))}
            eventHandlers={eventHandlers}
          />
        )
      }
      <Polyline
        pathOptions={{
          color: hovering ? shadeColor(color, -50) : color,
          weight: hovering ? 10 : 5,
        }}
        positions={
          [intendedToDisplay(structure1.coordinates), intendedToDisplay(structure2.coordinates)]
        }
        eventHandlers={eventHandlers}
      />
    </>
  );
}

export default StructureEdge;
