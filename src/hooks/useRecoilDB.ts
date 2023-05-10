import { RecoilState, useRecoilState, useResetRecoilState } from 'recoil';

import { Id } from '../utils/types';
import { generateId } from '../utils/utilities';

interface DBItem {
  readonly id: Id;
}

/**
 * Custom hook to work with specific recoil state objects like they're a database; provides methods
 * to get, create, modify and delete objects, taking a CRUD approach at the state. Objects are
 * provided a UUID to identify them.
 *
 * This hook works off of Recoil, meaning multiple uses in different components over the same atom
 * will synchronize with each other.
 * @param recoilState a recoil atom to base the store off of; this should be an atom that contains
 * a Map of ids to the items, and the items must also have the ids in them.
 * @returns an object with multiple functions to manage the "State database".
 */
function useRecoilDB<ItemType extends DBItem>(recoilState: RecoilState<Map<Id, ItemType>>) {
  const [items, setItems] = useRecoilState(recoilState);
  const resetItems = useResetRecoilState(recoilState);

  /**
   * Method to return the current number of items in this "state database".
   * @returns The current count.
   */
  const count = () => items.size;

  /**
   * Method to return all items in the "state database" as an unsorted array.
   * @returns An array of all items, unsorted.
   */
  const asArray = () => [...items.values()];

  /**
   * Method to retrieve a single item from the "state database".
   * @param id The item's id.
   * @returns The item if it exists; otherwise null.
   */
  const getItem = (id: Id) => items.get(id) ?? null;

  /**
   * Method to create a new item entry in the "state database".
   * @param info The item's info.
   * @returns The created item, with it's id inserted.
   */
  const createItem = (info: Omit<ItemType, 'id'>) => {
    const newId = generateId();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore // TODO: check this later
    const newItem: ItemType = { ...info, id: newId };
    const newItems = new Map(items);
    newItems.set(newId, newItem);
    setItems(newItems);
    return newItem;
  };

  /**
   * Method to modify a single item in the "state database".
   * @param id The item's id.
   * @param newData A partial (or complete) object with new data to replace.
   * @returns The modified item; or null if it doesn't exist.
   */
  const modifyItem = (id: Id, newData: Partial<Omit<ItemType, 'id'>>) => {
    const item = getItem(id);
    if (item === null) return null;
    const newItem = { ...item, ...newData };
    const newItems = new Map(items);
    newItems.set(id, newItem);
    setItems(newItems);
    return item;
  };

  /**
   * Method to delete a single item in the "state database".
   * @param id The item's id.
   * @returns The deleted item; or null if it didn't exist before deletion.
   */
  const deleteItem = (id: Id) => {
    const item = getItem(id);
    if (item === null) return null;
    const newItems = new Map(items);
    newItems.delete(id);
    setItems(newItems);
    return item;
  };

  /**
   * Method to reset the database to it's initial, default status.
   */
  const resetDB = () => {
    resetItems();
  };

  /**
   * Method to provided a serialized representation of the database that can be used to restore
   * the state.
   * @returns An object capable of being JSON stringified.
   */
  const toSerialized = () => Array.from(items.entries());

  /**
   * Method to restore the database state from the previously serialized object (using the
   * `toSerialized` method).
   * @param serialized The previously serialized object, already parsed.
   */
  const fromSerialized = (serialized: Array<[Id, ItemType]>) => {
    setItems(new Map(serialized));
  };

  return {
    items,
    count,
    asArray,
    getItem,
    createItem,
    modifyItem,
    deleteItem,
    resetDB,
    toSerialized,
    fromSerialized,
  };
}

export default useRecoilDB;
