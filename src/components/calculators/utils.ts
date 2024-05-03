export function calculateDistance(
  x1: number | null,
  y1: number | null,
  x2: number | null,
  y2: number | null,
  extra: number | null,
) {
  if (x1 === null || y1 === null || x2 === null || y2 === null) return null;
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2) + (extra ?? 0);
}

export function formatDistance(distance: number | null) {
  if (distance === null) return '∞';
  return distance.toFixed(3);
}

export function calculateTime(distance: number | null, speedPerHour: number | null) {
  if (distance === null || speedPerHour === null) return null;
  return (distance * 3600) / speedPerHour;
}

export function formatSeconds(seconds: number | null) {
  if (seconds === null) return '∞';
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
