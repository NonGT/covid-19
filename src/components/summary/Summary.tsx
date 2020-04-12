import React from 'react';
import {
  withStyles,
  WithStyles,
  Box,
} from '@material-ui/core';

import {
  FeaturesDataSource,
  MapViewFeature,
} from '@here/harp-features-datasource';

import * as turf from '@turf/turf';

import styles from './Summary.styles';
import MapView, { CameraParams } from '../map/MapView';
import { GeoJsonFeature, GeoCoordinates } from '../../core/types/geo';
import {
  createPolygonFeature,
  extractCoordinates,
} from '../../core/utils/mapUtils';

interface Props extends WithStyles<typeof styles> {
  countryCode: string;
  areaFeatures?: GeoJsonFeature[];
}

function getCenter(areaFeatures: GeoJsonFeature[]): GeoCoordinates {
  const allCoordinates = areaFeatures
    .map(extractCoordinates)
    .reduce((prev, coordinates) => [
      ...prev,
      ...coordinates,
    ], [])
    .map((coordinate) => turf.point(coordinate));

  const center = turf.center(turf.featureCollection(allCoordinates));
  const [longitude, latitude] = center.geometry?.coordinates as number[];

  return {
    latitude,
    longitude,
  };
}

const Summary: React.FC<Props> = ({ classes, areaFeatures }: Props) => {
  const currentCamera: CameraParams = {
    center: {
      latitude: 11.8700,
      longitude: 101.5925,
    },
    tilt: 45,
  };

  const featureDataSources: FeaturesDataSource[] = [];
  if (areaFeatures) {
    const mapViewFeatures = areaFeatures.map((feature) => createPolygonFeature(feature));
    currentCamera.center = getCenter(areaFeatures);

    const ds = new FeaturesDataSource({
      name: 'boundary',
      styleSetName: 'boundary',
      features: mapViewFeatures.filter((mf): mf is MapViewFeature => !!mf),
      maxGeometryHeight: 300000,
    });

    featureDataSources.push(ds);
  }

  return (
    <Box className={classes.root}>
      <MapView camera={currentCamera} features={featureDataSources} />
    </Box>
  );
};

export default withStyles(styles, { withTheme: true })(Summary);
