import { INFINITE_CHAR } from './constants';
import { Id } from './types';

/**
 * Shortcut function to generate a random unique universal identifier.
 * @returns A random uuid4
 */
export function generateId(): Id {
  return crypto.randomUUID();
}

/**
 * Format a time in seconds into a more human readable string.
 * @param seconds The time in seconds to format.
 * @returns A string formatted as `HH:MM:SS` (or `INFINITE_CHAR`).
 */
export function formatSeconds(seconds: number) {
  if (!Number.isFinite(seconds)) return INFINITE_CHAR;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const finalSeconds = Math.floor((seconds % 3600) % 60);

  function pad(num: number, size: number) {
    let numStr = num.toString();
    while (numStr.length < size) numStr = `0${numStr}`;
    return numStr;
  }

  return `${pad(hours, 2)}:${pad(minutes, 2)}:${pad(finalSeconds, 2)}`;
}

/**
 * Asynchronous wrapper around a FileReader's method.
 * @parm file File to read.
 * @returns The loaded content as a string.
 */
export function readFileAsString(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (typeof fr.result !== 'string') {
        reject(new Error(`Reader returned '${fr.result}' (type '${typeof fr.result}'.`));
        return;
      }
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsText(file);
  });
}

/**
 * Asynchronous wrapper around a FileReader's readAsDataURL method.
 * @param file File to read.
 * @returns The loaded DataURL.
 */
export function readFileAsURL(file: File) {
  return new Promise<string>((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      if (typeof fr.result !== 'string') {
        reject(new Error(`Reader returned '${fr.result}' (type '${typeof fr.result}'.`));
        return;
      }
      resolve(fr.result);
    };
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/**
 * Asynchronous wrapper around loading an image with the Image class.
 * @param url The URL to read from.
 * @returns The resulting Image object.
 */
export function readImageFromURL(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

/**
 * Split an array into two arrays given a condition to sort the elements out.
 * @param arr The array to split
 * @param condition The condition to check for.
 * @returns An array of two arrays with the elements that meet the condition in the first one, and
 * the values that don't in the second one.
 */
export function splitArray<ValueType>(arr: ValueType[], condition: (el: ValueType) => boolean) {
  return arr.reduce<[ValueType[], ValueType[]]>(([split1, split2], element) => {
    if (condition(element)) split1.push(element);
    else split2.push(element);
    return [split1, split2];
  }, [[], []]);
}
