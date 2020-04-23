import React from 'react';
import { withStyles, WithStyles, Box } from '@material-ui/core';

import { KeyMap } from '../../../core/types/common';
import SummaryMap from '../../../components/summaryMap';
import NetworkState from '../../../core/types/network';
import { GeoJsonFeatureCollection } from '../../../core/types/geo';
import { ResourcesIndex, RequestGeoJsonFunc } from '../resources/types';
import {
  DataSourceConfig,
  RequestDataFunc,
  CasesData,
  CountsData,
} from '../data/types';
import styles from './Dashboard.styles';

interface Props extends WithStyles<typeof styles> {
  networkStates: {
    resourcesIndex: NetworkState;
    geoJsons: NetworkState;
    dataSourceConfigs: NetworkState;
  };
  resourcesIndex?: ResourcesIndex;
  geoJsons?: KeyMap<string, GeoJsonFeatureCollection>;
  data?: {
    cases?: CasesData;
    counts?: CountsData;
  };
  dataSourceConfigs?: KeyMap<string, DataSourceConfig>;
  requestGeoJson: RequestGeoJsonFunc;
  requestData: RequestDataFunc;
  countryCode?: string;
  areaCode?: string;
}

const Dashboard: React.FC<Props> = ({
  classes,
  resourcesIndex,
  geoJsons,
  countryCode,
  areaCode,
  data,
}: Props) => {
  if (resourcesIndex && countryCode && geoJsons && data) {
    const { features } = geoJsons[countryCode];
    const areaFeatureProperty = resourcesIndex[countryCode]
      .geoNodes[areaCode || 'root'].keyProperty;

    return (
      <Box className={classes.root}>
        <SummaryMap
          classes={{
            root: classes.summaryView,
          }}
          countryCode={countryCode}
          areaFeatureProperty={areaFeatureProperty}
          areaFeatures={features}
          counts={data.counts}
          cases={data.cases}
        />
      </Box>
    );
  }

  return (
    <Box className={classes.root} />
  );
};

export default withStyles(styles, { withTheme: true })(Dashboard);
