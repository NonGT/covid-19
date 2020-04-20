export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeoJsonFeature {
  geometry: {
    type: string;
    coordinates: [];
  };
  properties: Record<string, unknown>;
}

export interface GeoJsonFeatureCollection {
  type: string;
  features: GeoJsonFeature[];
}
