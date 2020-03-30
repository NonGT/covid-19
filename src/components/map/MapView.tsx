import React, { useRef, useEffect, EffectCallback } from 'react';
import classnames from 'classnames';
import {
  withStyles,
  WithStyles,
} from '@material-ui/core';

import { MapView as HarpMapView, MapViewEventNames } from '@here/harp-mapview';
import { GeoCoordinates as HarpGeoCoordinates, sphereProjection } from '@here/harp-geoutils';
import { OmvDataSource, APIFormat, AuthenticationMethod } from '@here/harp-omv-datasource';
import { OmvTileDecoderService } from '@here/harp-omv-datasource/index-worker';

import styles from './MapView.styles';
import { GeoCoordinates } from '../../core/types/geo';

interface Props extends WithStyles<typeof styles> {
  location: GeoCoordinates;
}

OmvTileDecoderService.start();

const MapView: React.FC<Props> = ({ location, classes }: Props) => {
  const mapRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!mapRef.current) {
      return (): void => {};
    }

    const mapCanvas = mapRef.current;
    const mapView = new HarpMapView({
      canvas: mapCanvas,
      projection: sphereProjection,
      theme: '/mapTheme.json',
    });

    mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);

    const dataSource = new OmvDataSource({
      baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
      apiFormat: APIFormat.XYZOMV,
      styleSetName: 'tilezen',
      authenticationCode: 'II2hORmkhwFAopWVCgz1BejB-UwJsPjBfc8sNZLL3AI',
      authenticationMethod: {
        method: AuthenticationMethod.QueryString,
        name: 'apikey',
      },
    });

    mapView.addDataSource(dataSource);

    const initialCoordinates = new HarpGeoCoordinates(15.8700, 100.9925);
    const initialZoomLevel = 6;
    mapView.setCameraGeolocationAndZoom(initialCoordinates, initialZoomLevel);

    const onWindowResize = (): void => {
      mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    const onAfterRender = (): void => {
      const degree = 0;
      const heading = (degree + 0.1) % 360;
      mapView.lookAt(initialCoordinates, 4000000, 45, heading);
      mapView.update();
    };
    mapView.addEventListener(MapViewEventNames.AfterRender, onAfterRender);

    return (): void => {
      window.removeEventListener('resize', onWindowResize);
      mapView.removeEventListener(MapViewEventNames.AfterRender, onAfterRender);
    };
  });

  return (
    <canvas className={classes.root} ref={mapRef} />
  );
};

export default withStyles(styles,
  { withTheme: true })(MapView);
