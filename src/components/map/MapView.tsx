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

import { MapView as HarpMapView, MapViewEventNames, DataSource } from '@here/harp-mapview';
import { GeoCoordinates as HarpGeoCoordinates, sphereProjection } from '@here/harp-geoutils';
import { OmvDataSource, APIFormat, AuthenticationMethod } from '@here/harp-omv-datasource';
import { FeaturesDataSource } from '@here/harp-features-datasource';

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
  tileDataUrl?: string;
  styleSetName?: string;
  features?: FeaturesDataSource[];
}

const DEFAULT_CAMERA_DISTANCE = 3000000;
const DEFAULT_TILT = 45;
const DEFAULT_HEADING = 0;

function createMapView(
  mapCanvas: HTMLCanvasElement,
  themeUrl?: string,
  styleSetName?: string,
  tileDataUrl?: string,
): HarpMapView {
  const mapView = new HarpMapView({
    canvas: mapCanvas,
    projection: sphereProjection,
    theme: themeUrl || config.map.defaultTheme,
  });

  mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);

  const dataSource = new OmvDataSource({
    baseUrl: tileDataUrl || config.map.tileDataUrl,
    apiFormat: APIFormat.XYZOMV,
    styleSetName: styleSetName || config.map.defaultStyleSet,
    authenticationCode: config.map.authKey,
    authenticationMethod: {
      method: AuthenticationMethod.QueryString,
      name: config.map.authParamName,
    },
  });

  mapView.addDataSource(dataSource);
  mapView.renderLabels = false;

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
  tileDataUrl,
  features,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [
    currentFeatures,
    setCurrentFeatures,
  ] = useState<FeaturesDataSource[]>();

  const [currentMapView, setCurrentMapView] = useState<HarpMapView>();
  const { center } = camera;

  const coordinates = new HarpGeoCoordinates(
    center.latitude,
    center.longitude,
  );

  useEffect(() => {
    if (!canvasRef.current || !!currentMapView) {
      return (): void => {};
    }

    const mapCanvas = canvasRef.current;

    const mapView = createMapView(
      mapCanvas,
      themeUrl,
      styleSetName,
      tileDataUrl,
    );

    setCurrentMapView(mapView);

    const onWindowResize = (): void => {
      mapView.resize(mapCanvas.clientWidth, mapCanvas.clientHeight);
    };

    window.addEventListener('resize', onWindowResize);
    return (): void => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, [currentMapView, coordinates, themeUrl, styleSetName, tileDataUrl]);

  useEffect(() => {
    if (!currentMapView) {
      return (): void => {};
    }

    const onAfterRender = (): void => {
      updateMapViewCamera(currentMapView, camera);
    };

    if (currentFeatures) {
      currentFeatures.forEach((feature) => {
        // currentMapView.removeDataSource((feature as unknown) as DataSource);
      });
    }

    if (features && !currentFeatures) {
      setCurrentFeatures(features);
      features.forEach((feature) => {
        currentMapView.addDataSource((feature as unknown) as DataSource);
      });
    }

    currentMapView.addEventListener(MapViewEventNames.AfterRender, onAfterRender);
    return (): void => {
      currentMapView.removeEventListener(MapViewEventNames.AfterRender, onAfterRender);
    };
  }, [currentMapView, camera, features, currentFeatures]);

  return (
    <canvas className={classes.root} ref={canvasRef} />
  );
};

export default memo(withStyles(styles, { withTheme: true })(MapView));
