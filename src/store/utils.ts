import { v4 as uuidv4 } from 'uuid';

/**
 * Shortcut function to generate a random unique universal identifier.
 * @returns A random uuid4
 */
export function generateId() {
  return uuidv4();
}

export function insertAfter<T>(elementToInsert: T, arr: T[], after?: T) {
  if (after === undefined) return [...arr, elementToInsert];
  const index = arr.indexOf(after);
  if (index === -1) return [...arr, elementToInsert];
  const copyArr = [...arr];
  copyArr.splice(index + 1, 0, elementToInsert);
  return copyArr;
}
