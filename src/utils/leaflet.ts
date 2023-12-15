import * as L from 'leaflet';
import { Map } from 'leaflet';

import { readImageFromURL } from './utilities';

// https://gis.stackexchange.com/questions/54454/disable-leaflet-interaction-temporary

export function disableMapEvents(map: Map) {
  // @ts-ignore
  map._handlers.forEach((h) => h.disable());
}

export function enableMapEvents(map: Map) {
  // @ts-ignore
  map._handlers.forEach((h) => h.enable());
}

// Based on the leaflet.bigimage module

type CanvasImageData = {
  img: HTMLImageElement,
  x: number,
  y: number,
};

export async function mapToCanvas(map: Map) {
  // Set up a canvas
  const dimensions = map.getSize();
  const bounds = map.getPixelBounds();
  const canvas = document.createElement('canvas');
  canvas.width = dimensions.x;
  canvas.height = dimensions.y;
  const canvasCtx = canvas.getContext('2d');

  // Get the layers
  const promises: Promise<void>[] = [];

  const markers: Record<number, CanvasImageData> = {};
  async function handleMarker(layer: L.Marker) {
    // @ts-ignore
    if (layer._leaflet_id in markers) return;
    // @ts-ignore
    const pixelPoint = map.project(layer._latlng)
      .subtract([bounds.min?.x ?? 0, bounds.min?.y ?? 0]);
    if (layer.options.icon && layer.options.icon.options && layer.options.icon.options.iconAnchor) {
      // @ts-ignore
      pixelPoint.x -= layer.options.icon.options.iconAnchor[0];
      // @ts-ignore
      pixelPoint.x -= layer.options.icon.options.iconAnchor[1];
    }
    if (
      pixelPoint.x > 0
      && pixelPoint.y > 0
      && pixelPoint.x < canvas.width
      && pixelPoint.y < canvas.height
    ) {
      // @ts-ignore
      const img = await readImageFromURL(layer._icon.src);
      // @ts-ignore
      markers[layer._leaflet_id] = { img, x: pixelPoint.x, y: pixelPoint.y };
    }
  }
  const tileLayers: Record<string, CanvasImageData & { width: number, height: number }> = {};
  const toIndex = (tp: L.Point) => `${tp.x}:${tp.y}`;
  async function handleTileLayer(layer: L.TileLayer) {
    const tiles: L.Point[] = [];
    // @ts-ignore
    const tileSize = layer._tilesize.x;
    const tileBounds = L.bounds(
      // @ts-ignore
      bounds.min?.divideBy(tileSize)._floor() ?? 0,
      // @ts-ignore
      bounds.max?.divideBy(tileSize)._floor() ?? 0,
    );
    for (let i = (tileBounds.min?.y ?? 0); i < (tileBounds.max?.y ?? 0); i += 1) {
      for (let j = (tileBounds.min?.x ?? 0); j < (tileBounds.max?.x ?? 0); j += 1) {
        tiles.push(new L.Point(j, i));
      }
    }
    const tilePromises: Promise<void>[] = [];
    tiles.forEach((tilePoint) => {
      if (toIndex(tilePoint) in tileLayers) return;
      const original = tilePoint.clone();
      // @ts-ignore
      if (layer._adjustTilePoint) layer._adjustTilePoint(tilePoint);
      const tilePos = original.scaleBy(new L.Point(tileSize, tileSize))
        .subtract(bounds.min ?? [0, 0]);
      if (tilePoint.y < 0) return;
      tilePromises.push((async () => {
        // @ts-ignore
        const img = await readImageFromURL(layer.getTileUrl(tilePoint));
        tileLayers[toIndex(tilePoint)] = {
          img, x: tilePos.x, y: tilePos.y, width: tileSize, height: tileSize,
        };
      })());
    });

    await Promise.all(tilePromises);
  }

  const imageOverlays: Record<number, CanvasImageData> = {};
  async function handleImageOverlay(layer: L.ImageOverlay) {
    // TODO: this isn't placing the image in the right place
    // @ts-ignore
    if (layer._leaflet_id in imageOverlays) return;
    // @ts-ignore
    const pixelPoint = layer._image._leaflet_pos;
    // @ts-ignore
    const img = await readImageFromURL(layer._url);
    // @ts-ignore
    markers[layer._leaflet_id] = { img, x: pixelPoint.x, y: pixelPoint.y };
  }

  map.eachLayer((layer) => {
    // @ts-ignore
    if (layer instanceof L.Marker && layer._icon && layer._icon.src) {
      promises.push(handleMarker(layer));
    } else if (layer instanceof L.TileLayer) {
      promises.push(handleTileLayer(layer));
    } else if (layer instanceof L.ImageOverlay) {
      promises.push(handleImageOverlay(layer));
    }
  });
  await Promise.all(promises);
  Object.values((tileLayers)).forEach(
    (data) => canvasCtx?.drawImage(data.img, data.x, data.y, data.width, data.height),
  );
  Object.values((markers)).forEach((data) => canvasCtx?.drawImage(data.img, data.x, data.y));
  Object.values((imageOverlays)).forEach((data) => canvasCtx?.drawImage(data.img, data.x, data.y));
  return canvas;
}
