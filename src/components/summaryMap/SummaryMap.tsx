import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import {
  withStyles,
  WithStyles,
  Box,
} from '@material-ui/core';

import { MapViewFeature } from '@here/harp-features-datasource';

import * as turf from '@turf/turf';

import styles from './SummaryMap.styles';
import MapView, { CameraParams, MapViewFeatureSet } from '../map/MapView';
import { GeoJsonFeature, GeoCoordinates } from '../../core/types/geo';
import {
  createPolygonFeature,
  extractCoordinates,
} from '../../core/utils/mapUtils';
import { CasesData, CountsData } from '../../app/features/data/types';
import { aggregate, sum } from '../../core/utils/dataUtils';

interface Props extends WithStyles<typeof styles> {
  countryCode: string;
  areaFeatureProperty?: string;
  areaCode?: string;
  areaFeatures?: GeoJsonFeature[];
  counts?: CountsData;
  cases?: CasesData;
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

function normalizeChartHeight(count: number): number {
  const baseHeight = 10000;

  return Math.min(baseHeight + (2000 * count), 300000);
}

function extractAreaCode(feature: GeoJsonFeature, areaFeatureProperty: string): string {
  return feature.properties[areaFeatureProperty] as string || 'unknown';
}

const SummaryMap: React.FC<Props> = ({
  classes,
  areaFeatures,
  counts,
  areaFeatureProperty,
}: Props) => {
  const [date, setDate] = useState(moment().toDate());
  const prevCountByCaseArea = useRef<Record<string, number>>();

  const currentCamera: CameraParams = {
    center: {
      latitude: 11.8700,
      longitude: 101.5925,
    },
    tilt: 45,
  };

  const featureDataSet: MapViewFeatureSet[] = [];
  if (areaFeatures && areaFeatureProperty && counts) {
    currentCamera.center = getCenter(areaFeatures);

    const totalCount = aggregate(
      counts.items,
      sum('count'),
      undefined,
      (record) => (
        record.announceDate
          ? moment(record.announceDate as string).isSameOrBefore(date)
          : true
      ),
    ) as number;

    const countByCaseArea = aggregate(
      counts.items,
      sum('count'),
      ['caseArea'],
      (record) => (
        record.announceDate
          ? moment(record.announceDate as string).isSameOrBefore(date)
          : true
      ),
    ) as Record<string, number>;

    const mapViewFeatures = areaFeatures
      .map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          count: countByCaseArea
            && countByCaseArea[extractAreaCode(feature, areaFeatureProperty)],
          height: countByCaseArea
            && countByCaseArea[extractAreaCode(feature, areaFeatureProperty)]
            && totalCount
            && normalizeChartHeight(
              countByCaseArea[extractAreaCode(feature, areaFeatureProperty)],
            ),
        },
      }))
      .map((feature) => createPolygonFeature(feature));

    mapViewFeatures
      .filter((mf): mf is MapViewFeature => !!mf)
      .map((mf) => ({
        ...mf,
        uuid: extractAreaCode(mf as unknown as GeoJsonFeature, areaFeatureProperty),
      }))
      .forEach((mf) => {
        const fs: MapViewFeatureSet = {
          name: mf.uuid,
          styleSet: 'caseCharts',
          features: [mf],
        };

        featureDataSet.push(fs);
      });

    if (countByCaseArea) {
      prevCountByCaseArea.current = countByCaseArea;
    }
  }

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (moment(date).isBefore(moment())) {
  //       setDate(moment(date).add(1, 'day').toDate());
  //     }
  //   }, 1000);

  //   return (): void => {
  //     clearTimeout(timeout);
  //   };
  // });

  return (
    <Box className={classes.root}>
      <MapView camera={currentCamera} features={featureDataSet} />
    </Box>
  );
};

export default withStyles(styles, { withTheme: true })(SummaryMap);
