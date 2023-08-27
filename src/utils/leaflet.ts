import { Map } from 'leaflet';

// https://gis.stackexchange.com/questions/54454/disable-leaflet-interaction-temporary

export function disableMapEvents(map: Map) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line  no-underscore-dangle
  map._handlers.forEach((h) => h.disable());
}

export function enableMapEvents(map: Map) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line  no-underscore-dangle
  map._handlers.forEach((h) => h.enable());
}
