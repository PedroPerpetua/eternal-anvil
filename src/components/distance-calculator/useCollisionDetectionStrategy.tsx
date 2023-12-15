/**
 * Custom collision detection strategy optimized for multiple containers
 * Based on https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx#L195
 */

import { useCallback, useRef } from 'react';
import {
  CollisionDetection, closestCenter, getFirstCollision, pointerWithin, rectIntersection,
} from '@dnd-kit/core';
import { EntityId } from '@reduxjs/toolkit';

import { useAppSelector } from '../../store';
import { OUTSIDE_DROPPABLE_ID, calculatorsSelectors } from '../../store/distance-calculator/calculatorsSlice';

function useCollisionDetectionStrategy(): CollisionDetection {
  const lastOverId = useRef<EntityId | null>(null);
  const recentlyMovedToNewContainer = useRef(false);
  const tabs = useAppSelector(calculatorsSelectors.getCalculatorTabsMap);
  const draggingTab = useAppSelector(calculatorsSelectors.draggingTab);
  return useCallback((args) => {
    if (draggingTab && draggingTab in tabs) {
      return closestCenter({
        ...args,
        droppableContainers: args.droppableContainers.filter((container) => container.id in tabs),
      });
    }
    // Start by finding any intersecting droppable
    const pointerIntersections = pointerWithin(args);
    const intersections = pointerIntersections.length > 0
      // If there are droppables intersecting with the pointer, return those
      ? pointerIntersections
      : rectIntersection(args);
    let overId = getFirstCollision(intersections, 'id');

    if (overId != null) {
      if (overId === OUTSIDE_DROPPABLE_ID) {
        // If the intersecting droppable is the outside, return early
        return intersections;
      }

      if (overId in tabs) {
        const containerItems = tabs[overId];

        // If a container is matched and it contains items
        if (containerItems.length > 0) {
          // Return the closest droppable within that container
          overId = closestCenter({
            ...args,
            droppableContainers: args.droppableContainers.filter(
              (container) => container.id !== overId
                && containerItems.includes(container.id),
            ),
          })[0]?.id;
        }
      }

      lastOverId.current = overId;
      return [{ id: overId }];
    }
    // When a draggable item moves to a new container, the layout may shift
    // and the `overId` may become `null`. We manually set the cached `lastOverId`
    // to the id of the draggable item that was moved to the new container, otherwise
    // the previous `overId` will be returned which can cause items to incorrectly shift positions
    if (recentlyMovedToNewContainer.current) {
      lastOverId.current = draggingTab;
    }

    // If no droppable is matched, return the last match
    return lastOverId.current ? [{ id: lastOverId.current }] : [];
  }, [tabs, draggingTab]);
}

export default useCollisionDetectionStrategy;
