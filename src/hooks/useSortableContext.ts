import { useState } from 'react';
import {
  DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, DragOverEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

import { Id } from '../utils/types';
import { generateId, splitArray } from '../utils/utilities';

export type SortableItem<ValueType> = {
  id: Id,
  value: ValueType,
};

function useSortableContext<ContainerId extends string, ValueType>(
  initialContainers: ContainerId[] | Map<ContainerId, ValueType[]>,
) {
  // Parse the initial state
  const [items, setItems] = useState<Map<ContainerId, SortableItem<ValueType>[]>>(
    new Map(Array.isArray(initialContainers)
      // Array of containerIds, initialize all with empty arrays of items
      ? initialContainers.map((containerId) => [containerId, []])
      // Map of containers and items, parse it
      : [...initialContainers.entries()].map(([containerId, values]) => (
        [containerId, values.map((value) => ({ id: generateId(), value }))]
      ))),
  );
  const [activeItem, setActiveItem] = useState<SortableItem<ValueType> | null>(null);

  const addSortableItem = (containerId: ContainerId, ...values: ValueType[]) => {
    const container = items.get(containerId);
    if (!container) throw new Error(`ContainerId ${containerId} not found`);
    const newItems = new Map(items);
    newItems.set(
      containerId,
      [...container, ...[...values].map((v) => ({ id: generateId(), value: v }))],
    );
    setItems(newItems);
  };

  const removeSortableItem = (itemId: Id) => {
    const newItems = new Map(items);
    [...items.entries()].forEach(([containerId, containerItems]) => {
      newItems.set(containerId, containerItems.filter((v) => v.id !== itemId));
    });
    setItems(newItems);
  };

  const findContainer = (id: ContainerId | Id) => {
    if (items.has(id as ContainerId)) {
      return id as ContainerId;
    }
    // eslint-disable-next-line no-restricted-syntax
    for (const [containerId, containerItems] of items) {
      // eslint-disable-next-line no-restricted-syntax
      for (const item of containerItems) {
        if (item.id === id) return containerId;
      }
    }
    return null;
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
    // eslint-disable-next-line no-restricted-syntax
    for (const container of items.values()) {
      const item = container.find((i) => i.id === e.active.id);
      if (item) {
        setActiveItem(item);
        break;
      }
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    if (!e.over) return;
    const activeId = e.active.id as Id;
    const overId = e.over.id as Id | ContainerId;
    if (overId === activeId) return;
    const activeContainerId = findContainer(activeId);
    const overContainerId = findContainer(overId);
    if (!activeContainerId || !overContainerId || activeContainerId === overContainerId) return;
    // It's in a different container
    setItems((containers) => {
      const newContainers = new Map(containers);
      // Remove the item from it's container
      const activeItems = containers.get(activeContainerId) ?? [];
      const [filteredOut, newActiveItems] = splitArray(activeItems, (el) => el.id === activeId);
      newContainers.set(activeContainerId, newActiveItems);
      // Move it to the new over container
      const overItems = containers.get(overContainerId) ?? [];
      if (overId === overContainerId) {
        // Add to bottom
        newContainers.set(overContainerId, [...overItems, ...filteredOut]);
      } else {
        // Add it in the right position
        const activeRect = e.active.rect.current.translated;
        const overRect = e.over?.rect;
        const isBellowItem = activeRect && overRect
          && activeRect.top > overRect.top + overRect.height;
        const overIndex = overItems.findIndex((i) => i.id === overId);
        const newIndex = overIndex >= 0
          ? overIndex + (isBellowItem ? 1 : 0)
          : overItems.length + 1;
        newContainers.set(overContainerId, [
          ...overItems.slice(0, newIndex),
          ...filteredOut,
          ...overItems.slice(newIndex, overItems.length),
        ]);
      }
      return newContainers;
    });
  };

  const onDragEnd = (e: DragEndEvent) => {
    setActiveItem(null);
    const { active, over } = e;
    if (!over) return;
    if (over.id === active.id) return;
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
    if (!startingContainer) return;
    if (finalContainer === startingContainer) {
      // Same container
      const newContainerItems = [...items.get(startingContainer) ?? []];
      const idMap = newContainerItems.map((i) => i.id);
      const oldIndex = idMap.indexOf(active.id as Id);
      const newIndex = idMap.indexOf(over.id as Id);
      newItems.set(startingContainer, arrayMove(newContainerItems, oldIndex, newIndex));
      setItems(newItems);
    }
  };

  const handlers = {
    onDragStart,
    onDragOver,
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
    activeItem,
    addSortableItem,
    removeSortableItem,
    clearSortableItems,
    handlers,
    sensors,
  };
}

export default useSortableContext;
