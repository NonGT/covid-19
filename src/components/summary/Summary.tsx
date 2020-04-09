import React, { useState, useEffect } from 'react';
import {
  withStyles,
  WithStyles,
  Box,
} from '@material-ui/core';

import {
  FeaturesDataSource,
  MapViewFeature,
  MapViewPolygonFeature,
  MapViewMultiPolygonFeature,
} from '@here/harp-features-datasource';

import styles from './Summary.styles';
import MapView, { CameraParams } from '../map/MapView';
import { GeoJsonFeature } from '../../core/types/geo';

interface Props extends WithStyles<typeof styles> {
  countryCode: string;
}

const Summary: React.FC<Props> = ({ classes }: Props) => {
  const [currentCamera, setCurrentCamera] = useState<CameraParams>(
    { center: { latitude: 11.8700, longitude: 101.5925 }, tilt: 45 },
  );

  const [currentGeo, setCurrentGeo] = useState();
  const [features, setFeatures] = useState<FeaturesDataSource[]>();

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const heading = (currentCamera.heading || 0) % 360;
  //     const tiltFactor = Math.round(heading / 90) % 2;
  //     const tilt = (currentCamera.tilt || 0) + (tiltFactor === 0 ? -0.010 : 0.010);

  //     setCurrentCamera({
  //       center: { latitude: 9.8700, longitude: 100.9925 },
  //       heading: heading + 0.025,
  //       tilt,
  //     });
  //   }, 10);

  //   return (): void => {
  //     clearInterval(interval);
  //   };
  // }, [currentCamera.heading, currentCamera.tilt]);

  useEffect(() => {
    if (currentGeo) {
      return;
    }

    const test = async () => {
      const response = await fetch('/geojson/tha.geojson');
      const body = await response.text();
      const data = JSON.parse(body);

      setCurrentGeo(data);

      const mapViewFeatures: MapViewFeature[] = [];

      data.features.forEach((feature: GeoJsonFeature) => {
        const { type, coordinates } = feature.geometry;

        if (type === 'Polygon') {
          const mapViewFeature = new MapViewPolygonFeature(coordinates, {
            ...feature.properties,
            totalActiveCases: 500,
            height: 30000,
          });

          mapViewFeatures.push(mapViewFeature);
        }

        if (type === 'MultiPolygon') {
          const mapViewFeature = new MapViewMultiPolygonFeature(coordinates, {
            ...feature.properties,
            totalActiveCases: 500,
            height: 30000,
          });

          mapViewFeatures.push(mapViewFeature);
        }
      });

      const ds = new FeaturesDataSource({
        name: 'boundary',
        styleSetName: 'boundary',
        features: mapViewFeatures,
        maxGeometryHeight: 300000,
      });

      setFeatures([ds]);
    };

    test();
  });

  return (
    <Box
      className={classes.root}
    >
      <MapView camera={currentCamera} features={features} />
    </Box>
  );
};

export default withStyles(styles, { withTheme: true })(Summary);
