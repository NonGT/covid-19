import React, { useEffect } from 'react';
import { withStyles, WithStyles, Box } from '@material-ui/core';

import { KeyMap } from '../../../core/types/common';
import Summary from '../../../components/summary';
import NetworkState from '../../../core/types/network';
import { GeoJsonFeatureCollection } from '../../../core/types/geo';
import { ResourcesIndex, RequestGeoJsonFunc, RequestResourcesIndexFunc } from '../resources/types';
import { getDefaultCountryCode } from '../resources/utils';
import { RequestDataSourceConfigFunc, DataSourceConfig } from '../data/types';
import styles from './Dashboard.styles';

interface Props extends WithStyles<typeof styles> {
  networkStates: {
    resourcesIndex: NetworkState;
    geoJsons: NetworkState;
    dataSourceConfigs: NetworkState;
  };
  resourcesIndex?: ResourcesIndex;
  geoJsons?: KeyMap<string, GeoJsonFeatureCollection>;
  dataSourceConfigs?: KeyMap<string, DataSourceConfig>;
  requestGeoJson: RequestGeoJsonFunc;
  requestResourcesIndex: RequestResourcesIndexFunc;
  requestDataSourceConfig: RequestDataSourceConfigFunc;
}

const Dashboard: React.FC<Props> = ({
  classes,
  resourcesIndex,
  requestGeoJson,
  geoJsons,
}: Props) => {
  useEffect(() => {
    if (resourcesIndex) {
      const countryCode = getDefaultCountryCode(resourcesIndex);
      const { geoNodes } = resourcesIndex[countryCode] || {};
      const { url } = (geoNodes && geoNodes.root) || {};
      requestGeoJson({ key: countryCode, url });
    }
  }, [resourcesIndex, requestGeoJson]);

  if (resourcesIndex && geoJsons) {
    const countryCode = getDefaultCountryCode(resourcesIndex);
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
