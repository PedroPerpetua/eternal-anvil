/* eslint-disable import/prefer-default-export */
/**
 * Shortcut function to generate a random unique universal identifier.
 * @returns A random uuid4
 */
export function generateId() {
  return crypto.randomUUID();
}
