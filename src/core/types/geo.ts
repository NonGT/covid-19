export interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

export interface GeoJsonFeature {
  geometry: {
    type: string;
    coordinates: [];
  };

  properties: {
    province: string;
  };
}

export interface GeoJsonFeatureCollection {
  type: string;
  features: GeoJsonFeature[];
}
