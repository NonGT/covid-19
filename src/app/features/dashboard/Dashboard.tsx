import React, { useEffect } from 'react';
import { withStyles, WithStyles, Box } from '@material-ui/core';

import { KeyMap } from '../../../core/types/common';
import Summary from '../../../components/summary';
import NetworkState from '../../../core/types/network';
import { GeoJsonFeatureCollection } from '../../../core/types/geo';
import { ResourcesIndex, RequestGeoJsonFunc } from '../resources/types';
import { DataSourceConfig, RequestDataFunc, SummaryData } from '../data/types';
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
    summary?: SummaryData;
  };
  dataSourceConfigs?: KeyMap<string, DataSourceConfig>;
  requestGeoJson: RequestGeoJsonFunc;
  requestData: RequestDataFunc;
  countryCode?: string;
}

const Dashboard: React.FC<Props> = ({
  classes,
  resourcesIndex,
  geoJsons,
  countryCode,
  requestGeoJson,
  requestData,
}: Props) => {
  useEffect(() => {
    if (resourcesIndex && countryCode) {
      const { geoNodes } = resourcesIndex[countryCode] || {};
      const { url } = (geoNodes && geoNodes.root) || {};
      requestGeoJson({ key: countryCode, url });
      requestData({ key: 'summary', params: { limit: '100' } });
    }
  }, [countryCode, resourcesIndex, requestGeoJson, requestData]);

  if (resourcesIndex && countryCode && geoJsons) {
    const { features } = geoJsons[countryCode];

    return (
      <Box className={classes.root}>
        <Summary
          classes={{
            root: classes.summaryView,
          }}
          countryCode={countryCode}
          areaFeatures={features}
        />
      </Box>
    );
  }

  return (
    <Box className={classes.root} />
  );
};

export default withStyles(styles, { withTheme: true })(Dashboard);
