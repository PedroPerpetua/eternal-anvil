import type { Schedule as ApiSchedule } from '../../../api/models';

export const intervalDuration = 30;
export const dailyTicks = (60 / intervalDuration) * 24;
export const borderCSS = '2px solid black';
export const thinBorderCSS = '1px dashed black';
export const rowHeightCSS = '15px';
export const colWidthCSS = '75px';

export function getLocalizedWeekDays(locale: string) {
  return Array(7)
    .fill(0)
    .map((_, i) => new Date(1, 3, i + 1).toLocaleString(locale, { weekday: 'short' }));
}

export function getLocalizedTimes(locale: string) {
  return Array(dailyTicks + 1).fill(0).map((_, i) => {
    const date = new Date();
    date.setHours(Math.floor(i / 2));
    date.setMinutes((i % 2) * 30);
    return date.toLocaleString(locale, { timeStyle: 'short' });
  });
}

/**
 * Utility functions to deal with a Schedule data structure.
 * A Schedule is an array of numbers that represents availability; a number on this array indicates
 * when the availability "flips", assumed to start as non-available. Some examples:
 * * NA -> Not-Available; AV -> Available
 * [3, 7, 10] -> NA from 0 to 2; AV from 3 to 6; NA from 7 to 9; AV from 10 to the end.
 * [0, 4, 25, 30] -> AV from 0 to 3; NA from 4 to 24; AV from 25 to 29; NA from 30 to the end.
 *
 * Unfortunately, I couldn't figure out the math on how to do calculations with the schedules in
 * array form... so I did the Unga Bunga method and converted them to easier-to-work-with boolean
 * arrays, made calculations over them, and converted back to number arrays.
 *
 * This is kinda stupid but it works.
 */

export type SchedulerValue = [number[], number[], number[], number[], number[], number[], number[]];

function toBoolArray(daySchedule: number[]): boolean[] {
  const retval: boolean[] = [];
  let current = false;
  for (let i = 0; i < dailyTicks; i += 1) {
    if (daySchedule.includes(i)) {
      current = !current;
    }
    retval.push(current);
  }
  return retval;
}

function fromBoolArray(arr: boolean[]): number[] {
  const retval: number[] = [];
  let current = false;
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] !== current) {
      retval.push(i);
      current = !current;
    }
  }
  return retval;
}

function flipInBool(dayScheduleAsBool: boolean[], interval: [number, number], value: boolean) {
  const newSchedule = [...dayScheduleAsBool];
  const start = Math.min(...interval);
  const end = Math.max(...interval);

  while (newSchedule.length < end + 1) {
    newSchedule.push(dayScheduleAsBool.at(-1) ?? false);
  }
  for (let i = start; i < end; i += 1) {
    newSchedule[i] = value;
  }
  return newSchedule;
}

export function isActiveInDay(daySchedule: number[], value: number) {
  return (daySchedule.filter((v) => v <= value).length % 2) !== 0;
}

export function isActive(value: SchedulerValue, cell: [number, number]) {
  const day = value[cell[0]];
  return isActiveInDay(day, cell[1]);
}

function flipActive(daySchedule: number[], flipInterval: [number, number], setActive: boolean) {
  const asBool = toBoolArray(daySchedule);
  const flipped = flipInBool(asBool, flipInterval, setActive);
  return fromBoolArray(flipped);
}

export function applyDelta(value: SchedulerValue, start: [number, number], end: [number, number]) {
  const newValue = value.map((arr) => [...arr]) as SchedulerValue;
  const setActive = !isActive(value, start);
  // We basically want to apply the delta "as a square"
  // So we take the [day, time] corners
  const corner1 = [Math.min(start[0], end[0]), Math.min(start[1], end[1])];
  const corner2 = [Math.max(start[0], end[0]), Math.max(start[1], end[1])];
  for (let i = corner1[0]; i <= corner2[0]; i += 1) {
    newValue[i] = flipActive(newValue[i], [corner1[1], corner2[1] + 1], setActive);
  }
  return newValue;
}

export function applyTimezone(value: SchedulerValue, timezoneDiff: number) {
  const original = value.map((arr) => toBoolArray(arr));
  const newValue = new Array(value.length).fill([]).map((arr) => toBoolArray(arr));

  for (let i = 0; i < newValue.length; i += 1) {
    const arrAfterIndex = (i + 1) % newValue.length;
    const arrBeforeIndex = (newValue.length + i - 1) % newValue.length;
    for (let j = 0; j < newValue[i].length; j += 1) {
      const lookupIndex = j - timezoneDiff;
      let col = i;
      let row = j;
      if (lookupIndex >= dailyTicks) {
        col = arrAfterIndex;
        row = lookupIndex - dailyTicks;
      } else if (lookupIndex < 0) {
        col = arrBeforeIndex;
        row = lookupIndex + dailyTicks;
      } else {
        row = lookupIndex;
      }
      newValue[i][j] = original[col][row];
    }
  }
  return newValue.map((arr) => fromBoolArray(arr)) as SchedulerValue;
}

export function toApiDTO(value: SchedulerValue): ApiSchedule {
  // Apply the current timezone to the user
  const offsetMinutes = new Date().getTimezoneOffset();
  const withTimezone = applyTimezone(value, Math.floor(offsetMinutes / intervalDuration));
  // The api takes intervals of 5 minutes instead, so map it.
  const adjustment = intervalDuration / 5;
  // It also never considers the last "24 hour" one.
  const adjusted = withTimezone.map(
    (d) => d.filter((v) => v !== dailyTicks).map((v) => v * adjustment),
  );
  return {
    monday: adjusted[0],
    tuesday: adjusted[1],
    wednesday: adjusted[2],
    thursday: adjusted[3],
    friday: adjusted[4],
    saturday: adjusted[5],
    sunday: adjusted[6],
  };
}

export function fromApiDTO(value: ApiSchedule): SchedulerValue {
  const schedule: SchedulerValue = [
    value.monday ?? [],
    value.tuesday ?? [],
    value.wednesday ?? [],
    value.thursday ?? [],
    value.friday ?? [],
    value.saturday ?? [],
    value.sunday ?? [],
  ];
  // The api takes intervals of 5 minutes instead, so map it.
  const adjusted = schedule.map(
    (arr) => arr.map((v) => v * (5 / intervalDuration)),
  ) as SchedulerValue;
  // Adjust for timezone
  const offsetMinutes = new Date().getTimezoneOffset();
  return applyTimezone(adjusted, -Math.floor(offsetMinutes / intervalDuration));
}
