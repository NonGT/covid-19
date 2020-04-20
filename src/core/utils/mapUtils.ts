import * as turf from '@turf/turf';

import {
  MapViewFeature,
  MapViewPolygonFeature,
  MapViewMultiPolygonFeature,
} from '@here/harp-features-datasource';

import { GeoJsonFeature } from '../types/geo';

export function createPolygonFeature(
  feature: GeoJsonFeature,
): MapViewFeature | undefined {
  const { type, coordinates } = turf.simplify(feature.geometry, { tolerance: 0.03 });

  if (type === 'Polygon') {
    return new MapViewPolygonFeature(coordinates, feature.properties);
  }

  if (type === 'MultiPolygon') {
    return new MapViewMultiPolygonFeature(coordinates, feature.properties);
  }

  return undefined;
}

export function extractCoordinates(feature: GeoJsonFeature): number[][] {
  const { type, coordinates } = feature.geometry;
  const initial: number[][] = [];

  if (type === 'Polygon') {
    return coordinates.reduce((prev, curr) => [
      ...prev,
      ...(curr as number[][]),
    ], initial);
  }

  if (type === 'MultiPolygon') {
    return coordinates.reduce((prev, curr) => [
      ...prev,
      ...(curr[0] as number[][]),
    ], initial);
  }

  return initial;
}
