import React, {
  useRef,
  useEffect,
  useState,
  memo,
} from 'react';

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

export interface CameraParams {
  center: GeoCoordinates;
  distance?: number;
  heading?: number;
  tilt?: number;
}

interface Props extends WithStyles<typeof styles> {
  camera: CameraParams;
  themeUrl?: string;
  dataSourceUrl?: string;
  styleSetName?: string;
}

const DEFAULT_CAMERA_DISTANCE = 3000000;
const DEFAULT_TILT = 45;
const DEFAULT_HEADING = 0;

function createMapView(
  mapCanvas: HTMLCanvasElement,
  themeUrl?: string,
  styleSetName?: string,
  dataSourceUrl?: string,
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

  return mapView;
}

function updateMapViewCamera(mapView: HarpMapView, params: CameraParams): void {
  const {
    center,
    distance,
    heading,
    tilt,
  } = params;

  const headingDegree = heading || DEFAULT_HEADING;
  const normalizedHeading = headingDegree % 360;
  const coordinates = new HarpGeoCoordinates(
    center.latitude,
    center.longitude,
  );

  mapView.lookAt(
    coordinates,
    distance || DEFAULT_CAMERA_DISTANCE,
    tilt || DEFAULT_TILT,
    normalizedHeading,
  );

  mapView.update();
}

const MapView: React.FC<Props> = ({
  classes,
  camera,
  themeUrl,
  styleSetName,
  dataSourceUrl,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentMapView, setCurrentMapView] = useState<HarpMapView | null>(null);
  const { center } = camera;

  const coordinates = new HarpGeoCoordinates(
    center.latitude,
    center.longitude,
  );

  useEffect(() => {
    if (!canvasRef.current || currentMapView != null) {
      return (): void => {};
    }

    const mapCanvas = canvasRef.current;

    const mapView = createMapView(
      mapCanvas,
      themeUrl,
      styleSetName,
      dataSourceUrl,
    );

    setCurrentMapView(mapView);

    const onWindowResize = (): void => {
      mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);
    };

    window.addEventListener('resize', onWindowResize);
    return (): void => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [currentMapView, coordinates, themeUrl, styleSetName, dataSourceUrl]);

  useEffect(() => {
    if (currentMapView == null) {
      return (): void => {};
    }

    const mapView = currentMapView;
    const onAfterRender = (): void => {
      updateMapViewCamera(mapView, camera);
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

export default memo(withStyles(styles, { withTheme: true })(MapView));
