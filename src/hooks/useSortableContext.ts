import { useState } from 'react';
import {
  DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { Id } from '../utils/types';
import { generateId } from '../utils/utilities';

type SortableItem<ValueType> = {
  id: Id,
  value: ValueType,
};

function useSortableContext<ContainerId extends string, ValueType>(
  initialContainers: ContainerId[] | Map<ContainerId, ValueType[]>,
) {
  // Parse the initial state
  const initialItems: Map<ContainerId, SortableItem<ValueType>[]> = new Map(
    Array.isArray(initialContainers)
    // Array of containerIds, initialize all with empty arrays of items
      ? initialContainers.map((containerId) => [containerId, []])
    // Map of containers and items, parse it
      : [...initialContainers.entries()].map(([containerId, values]) => (
        [containerId, values.map((value) => ({ id: generateId(), value }))]
      )),
  );
  const [items, setItems] = useState(initialItems);

  const addSortableItem = (containerId: ContainerId, value: ValueType) => {
    const container = items.get(containerId);
    if (!container) throw new Error(`ContainerId ${containerId} not found; '${value}' not added.`);
    const newItem = { id: generateId(), value };
    const newItems = new Map(items);
    newItems.set(containerId, [...container, newItem]);
    setItems(newItems);
  };

  const removeSortableItem = (itemId: Id) => {
    const newItems = new Map(items);
    [...items.entries()].forEach(([containerId, containerItems]) => {
      newItems.set(containerId, containerItems.filter((v) => v.id !== itemId));
    });
    setItems(newItems);
  };

  const clearSortableItems = () => {
    const newItems = new Map(items);
    [...items.keys()].forEach((containerId) => {
      newItems.set(containerId, []);
    });
    setItems(newItems);
  };

  // DnD Handlers
  const onDragStart = (e: DragStartEvent) => {
    console.log('DRAG START', e);
  };

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    const newItems = new Map(items);
    let startingContainer: ContainerId | null = null;
    let finalContainer: ContainerId | null = null;
    // eslint-disable-next-line no-restricted-syntax
    for (const [containerId, containerItems] of items) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of containerItems) {
        if (item.id === active.id) startingContainer = containerId;
        if (item.id === over.id) finalContainer = containerId;
      }
    }
    if (!finalContainer || !startingContainer) return;
    if (finalContainer === startingContainer) {
      // Same container
      const newContainerItems = [...items.get(startingContainer) ?? []];
      const idMap = newContainerItems.map((i) => i.id);
      const oldIndex = idMap.indexOf(active.id as Id);
      const newIndex = idMap.indexOf(over.id as Id);
      newItems.set(startingContainer, arrayMove(newContainerItems, oldIndex, newIndex));
      setItems(newItems);
      return;
    }
    console.log('DRAG END', e);
  };

  const handlers = {
    onDragStart,
    onDragEnd,
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return {
    items,
    addSortableItem,
    removeSortableItem,
    clearSortableItems,
    handlers,
    sensors,
  };
}

export default useSortableContext;
