import { useState } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { Id } from '../utils/types';
import { generateId } from '../utils/utilities';

function useSortableState<ValueType>(initialValue: ValueType[] = []) {
  const [items, setItems] = useState<{ value: ValueType, id: Id }[]>(
    initialValue.map((i) => ({ value: i, id: generateId() })),
  );

  const addItem = (...value: ValueType[]) => {
    const newItems = value.map((v) => ({ value: v, id: generateId() }));
    setItems([...items, ...newItems]);
  };

  const removeItem = (id: Id) => {
    setItems(items.filter((i) => (i.id !== id)));
  };

  const moveItem = (id: Id, afterId: Id) => {
    if (id === afterId) return;
    const idMap = items.map((i) => i.id);
    const oldIndex = idMap.indexOf(id);
    const newIndex = idMap.indexOf(afterId);
    setItems(arrayMove(items, oldIndex, newIndex));
  };

  const moveItemDragEndEventHandler = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over) return;
    moveItem(active.id as Id, over.id as Id);
  };

  const clearItems = () => {
    setItems([]);
  };

  return {
    items,
    addItem,
    removeItem,
    moveItem,
    moveItemDragEndEventHandler,
    clearItems,
  };
}

export default useSortableState;
