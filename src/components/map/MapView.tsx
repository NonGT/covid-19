import React, { useRef, useEffect, useState } from 'react';

import {
  withStyles,
  WithStyles,
} from '@material-ui/core';

import { MapView as HarpMapView, MapViewEventNames } from '@here/harp-mapview';
import { GeoCoordinates as HarpGeoCoordinates, sphereProjection } from '@here/harp-geoutils';
import { OmvDataSource, APIFormat, AuthenticationMethod } from '@here/harp-omv-datasource';

import styles from './MapView.styles';
import { GeoCoordinates } from '../../core/types/geo';
import * as config from '../../config';

interface Props extends WithStyles<typeof styles> {
  location: GeoCoordinates;
  themeUrl?: string;
  dataSourceUrl?: string;
  styleSetName?: string;
  zoomLevel?: number;
  cameraDistance?: number;
  heading?: number;
  tilt?: number;
  orbit?: boolean;
}

const DEFAULT_ZOOM_LEVEL = 6;
const DEFAULT_CAMERA_DISTANCE = 3000000;
const DEFAULT_TILT = 45;
const DEFAULT_HEADING = 0;

function createMapView(
  mapCanvas: HTMLCanvasElement,
  coordinates: HarpGeoCoordinates,
  themeUrl?: string,
  styleSetName?: string,
  dataSourceUrl?: string,
  zoomLevel?: number,
): HarpMapView {
  const mapView = new HarpMapView({
    canvas: mapCanvas,
    projection: sphereProjection,
    theme: themeUrl || config.map.defaultTheme,
  });

  mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);

  const dataSource = new OmvDataSource({
    baseUrl: dataSourceUrl || config.map.dataSourceUrl,
    apiFormat: APIFormat.XYZOMV,
    styleSetName: styleSetName || config.map.defaultStyleSet,
    authenticationCode: config.map.authKey,
    authenticationMethod: {
      method: AuthenticationMethod.QueryString,
      name: config.map.authParamName,
    },
  });

  mapView.addDataSource(dataSource);

  mapView.setCameraGeolocationAndZoom(
    coordinates,
    zoomLevel || DEFAULT_ZOOM_LEVEL,
  );

  return mapView;
}

const MapView: React.FC<Props> = ({
  classes,
  location,
  themeUrl,
  styleSetName,
  dataSourceUrl,
  zoomLevel,
  cameraDistance,
  heading,
  tilt,
  orbit,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentHeading, setCurrentHeading] = useState(heading);
  const [currentMapView, setCurrentMapView] = useState<HarpMapView | null>(null);

  const coordinates = new HarpGeoCoordinates(
    location.latitude,
    location.longitude,
  );

  useEffect(() => {
    if (!canvasRef.current || currentMapView != null) {
      return (): void => {};
    }

    const mapCanvas = canvasRef.current;

    const mapView = createMapView(
      mapCanvas,
      coordinates,
      themeUrl,
      styleSetName,
      dataSourceUrl,
      zoomLevel,
    );

    setCurrentMapView(mapView);

    const onWindowResize = (): void => {
      mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);
    };
    window.addEventListener('resize', onWindowResize);

    return (): void => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [currentMapView, coordinates, themeUrl, styleSetName, dataSourceUrl, zoomLevel]);

  useEffect(() => {
    if (currentMapView == null) {
      return (): void => {};
    }

    const mapView = currentMapView;

    const onAfterRender = (): void => {
      const headingDegree = currentHeading || DEFAULT_HEADING;
      const normalizedHeading = headingDegree % 360;
      mapView.lookAt(
        coordinates,
        cameraDistance || DEFAULT_CAMERA_DISTANCE,
        tilt || DEFAULT_TILT,
        normalizedHeading,
      );
      mapView.update();

      if (orbit) {
        setCurrentHeading(headingDegree + 0.05);
      }
    };

    mapView.addEventListener(MapViewEventNames.AfterRender, onAfterRender);

    return (): void => {
      mapView.removeEventListener(MapViewEventNames.AfterRender, onAfterRender);
    };
  });

  return (
    <canvas className={classes.root} ref={canvasRef} />
  );
};

export default withStyles(styles,
  { withTheme: true })(MapView);
