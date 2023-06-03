import { useState } from 'react';
import { DivIcon } from 'leaflet';
import { Marker, Polyline } from 'react-leaflet';

import useBattleMapStore, { Edge } from '../../../hooks/useBattleMapStore';
import { DISTANCE_PENALTIES } from '../../../utils/constants';
import { blendColors, shadeColor } from '../../../utils/cssTintFilter';
import { calcDistance, halfway } from '../../../utils/math';
import { HexColor } from '../../../utils/types';

type StructureEdgeProps = {
  edge: Edge
};

function StructureEdge({ edge }: StructureEdgeProps) {
  const { getStructure, intendedToDisplay, getTeam, deleteEdge } = useBattleMapStore();
  const [hovering, setHovering] = useState(false);
  const structure1 = getStructure(edge[0]);
  const structure2 = getStructure(edge[1]);
  if (structure1 === null || structure2 === null) return null;
  const team1 = getTeam(structure1?.team);
  const team2 = getTeam(structure2.team);
  if (team1 === null || team2 === null) return null;

  let color = '#000000' as HexColor;
  let distanceText = '<distance>';
  if (team1.id === team2.id) {
    // Same team
    color = team1.color;
    const distance = calcDistance(
      structure1.coordinates,
      structure2.coordinates,
    );
    distanceText = `
      J ${distance.toFixed(2)}<br>
      S ${(distance + DISTANCE_PENALTIES.SUPPORT.penalty).toFixed(2)}
    `;
  } else {
    color = blendColors(team1.color, team2.color);
    const distance = calcDistance(
      structure1.coordinates,
      structure2.coordinates,
    );
    distanceText = `
      J ${distance.toFixed(2)}<br>
      R ${(distance + DISTANCE_PENALTIES.RAID.penalty).toFixed(2)}<br>
      C ${(distance + DISTANCE_PENALTIES.CONQUER_DESTROY.penalty).toFixed(2)}
    `;
  }
  const shadedColor = shadeColor(color, -50);

  const eventHandlers = {
    click: () => deleteEdge(edge),
    mouseover: () => setHovering(true),
    mouseout: () => setHovering(false),
  };

  return (
    <>
      {
        hovering && (
          <Marker
            icon={new DivIcon({
              html: `<p style="color: ${shadedColor}">${distanceText}</p>`,
              className: 'marker-text',
            })}
            position={intendedToDisplay(halfway(structure1.coordinates, structure2.coordinates))}
            eventHandlers={eventHandlers}
          />
        )
      }
      <Polyline
        pathOptions={{
          color: hovering ? shadedColor : color,
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
