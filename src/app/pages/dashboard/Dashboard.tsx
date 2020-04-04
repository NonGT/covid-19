import React, { useState, useEffect } from 'react';
import { withStyles, Box, WithStyles } from '@material-ui/core';

import styles from './Dashboard.styles';
import MapView from '../../../components/map';
import { CameraParams } from '../../../components/map/MapView';

interface Props extends WithStyles<typeof styles> {
  countryCode: string;
}

const Dashboard: React.FC<Props> = ({ classes }: Props) => {
  const [currentCamera, setCurrentCamera] = useState<CameraParams>(
    { center: { latitude: 9.8700, longitude: 100.9925 }, tilt: 45 },
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const heading = (currentCamera.heading || 0) % 360;
      const tiltFactor = Math.round(heading / 90) % 2;
      const tilt = (currentCamera.tilt || 0) + (tiltFactor === 0 ? -0.010 : 0.010);

      setCurrentCamera({
        center: { latitude: 9.8700, longitude: 100.9925 },
        heading: heading + 0.025,
        tilt,
      });

    }, 10);

    return (): void => {
      clearInterval(interval);
    };
  }, [currentCamera.heading, currentCamera.tilt]);

  return (
    <MapView camera={currentCamera} />
  );
};

export default withStyles(styles, { withTheme: true })(Dashboard);
