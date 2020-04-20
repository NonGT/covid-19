import React, {
  useRef,
  useEffect,
  useState,
  memo,
  MutableRefObject,
} from 'react';

import {
  withStyles,
  WithStyles,
} from '@material-ui/core';

import * as uuid from 'uuid';

import { MapView as HarpMapView, MapViewEventNames, DataSource } from '@here/harp-mapview';
import { GeoCoordinates as HarpGeoCoordinates, sphereProjection } from '@here/harp-geoutils';
import { OmvDataSource, APIFormat, AuthenticationMethod } from '@here/harp-omv-datasource';
import { FeaturesDataSource, MapViewFeature } from '@here/harp-features-datasource';

import styles from './MapView.styles';
import { GeoCoordinates } from '../../core/types/geo';
import * as config from '../../config';

export interface CameraParams {
  center: GeoCoordinates;
  distance?: number;
  heading?: number;
  tilt?: number;
}

export interface MapViewFeatureSet {
  name: string;
  styleSet: string;
  features: MapViewFeature[];
}

interface Props extends WithStyles<typeof styles> {
  camera: CameraParams;
  themeUrl?: string;
  tileDataUrl?: string;
  styleSetName?: string;
  features?: MapViewFeatureSet[];
}

const DEFAULT_CAMERA_DISTANCE = 2700000;
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

function updateFeatureDataSource(
  mapView: HarpMapView,
  currentFeatureSets: MapViewFeatureSet[],
  newFeatureSets: MapViewFeatureSet[],
  dataSourceLookupRef: MutableRefObject<Record<string, FeaturesDataSource>>,
): FeaturesDataSource[] {
  const dsLookup = dataSourceLookupRef.current;
  const existingSetLookup = currentFeatureSets.reduce((lookup, fs) => ({
    ...lookup,
    [fs.name]: fs,
  }), {} as Record<string, MapViewFeatureSet>);

  const dataSourceToBeRemoved: FeaturesDataSource[] = [];

  newFeatureSets.forEach((fs) => {
    const ds = dataSourceLookupRef.current[fs.name];
    const featuresDataSource = ds
      ? (ds as unknown as FeaturesDataSource)
      : new FeaturesDataSource({
        name: fs.name,
        styleSetName: fs.styleSet,
      });

    if (!ds) {
      mapView.addDataSource(featuresDataSource as unknown as DataSource);
      dsLookup[fs.name] = featuresDataSource;
    }

    // We do not update all features, only the feature data that has been updated.
    // So we will remove/add only the one that the properties has been changed.
    const existingFs = existingSetLookup[fs.name];
    const existingFeatureLookup = existingFs && existingFs.features.reduce((lookup, feature) => ({
      ...lookup,
      [feature.uuid]: feature,
    }), {} as Record<string, MapViewFeature>);

    fs.features.forEach((feature) => {
      const existingFeature = existingFeatureLookup && existingFeatureLookup[feature.uuid];
      if (!existingFeature) {
        featuresDataSource?.add(feature);
        return;
      }

      if (JSON.stringify(existingFeature) !== JSON.stringify(feature)) {
        const newFeaturesDataSource = new FeaturesDataSource({
          name: uuid.v4(),
          styleSetName: fs.styleSet,
        });

        newFeaturesDataSource.add(feature);
        mapView.addDataSource(newFeaturesDataSource as unknown as DataSource);
        dsLookup[fs.name] = newFeaturesDataSource;

        dataSourceToBeRemoved.push(featuresDataSource);
      }
    });

    mapView.update();
  });

  return dataSourceToBeRemoved;
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
  const [currentMapView, setCurrentMapView] = useState<HarpMapView>();
  const { center } = camera;

  const currentFeaturesRef = useRef([] as MapViewFeatureSet[]);
  const dataSourceLookupRef = useRef({} as Record<string, FeaturesDataSource>);
  const dataSourceToBeRemoved = useRef([] as FeaturesDataSource[]);

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

    dataSourceToBeRemoved.current.forEach((ds) => {
      ds.clear();
      ds.clearCache();
      ds.dispose();
      currentMapView.removeDataSource(ds as unknown as DataSource);
    });

    if (features && features !== currentFeaturesRef.current) {
      dataSourceToBeRemoved.current = updateFeatureDataSource(
        currentMapView,
        currentFeaturesRef.current,
        features,
        dataSourceLookupRef,
      );

      currentFeaturesRef.current = features;
    }

    currentMapView.addEventListener(MapViewEventNames.AfterRender, onAfterRender);
    return (): void => {
      currentMapView.removeEventListener(MapViewEventNames.AfterRender, onAfterRender);
    };
  }, [currentMapView, camera, features]);

  return (
    <canvas className={classes.root} ref={canvasRef} />
  );
};

export default memo(withStyles(styles, { withTheme: true })(MapView));
