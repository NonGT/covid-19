import React, { useRef, useEffect } from 'react';
import classnames from 'classnames';
import {
  withStyles,
  WithStyles,
} from '@material-ui/core';

import { MapView as HarpMapView } from '@here/harp-mapview';
import { GeoCoordinates as HarpGeoCoordinates } from '@here/harp-geoutils';
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
      return;
    }

    const mapCanvas = mapRef.current;
    const mapView = new HarpMapView({
      canvas: mapCanvas,
      theme: 'node_modules/@here/harp-map-theme/resources/berlin_tilezen_base.json',
      decoderUrl: 'harp-gl-decoders.bundle.js',
    });

    mapView.camera.position.set(0, 0, 800);
    mapView.geoCenter = new HarpGeoCoordinates(40.70398928, -74.01319808, 0);
    mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);

    const dataSource = new OmvDataSource({
      baseUrl: 'https://vector.hereapi.com/v2/vectortiles/base/mc',
      apiFormat: APIFormat.XYZOMV,
      styleSetName: 'tilezen',
      authenticationCode: 'II2hORmkhwFAopWVCgz1BejB-UwJsPjBfc8sNZLL3AI',
      authenticationMethod: {
        method: AuthenticationMethod.AuthorizationHeader,
        name: 'apikey',
      },
    });
    mapView.addDataSource(dataSource);
  });

  return (
    <canvas className={classes.root} ref={mapRef} />
  );
};

export default withStyles(styles,
  { withTheme: true })(MapView);
