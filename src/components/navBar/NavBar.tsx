import React from 'react';
import classnames from 'classnames';
import {
  withStyles,
  WithStyles,
  useScrollTrigger,
  AppBar,
  Toolbar,
  Typography,
} from '@material-ui/core';

import styles from './NavBar.styles';

const DEFAULT_SCROLL_THRESHOLD = 50;

interface Props extends WithStyles<typeof styles> {
  window?: () => Window;
  scrollThreshold?: number;
}

const NavBar: React.FC<Props> = ({ window, scrollThreshold, classes }: Props) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: scrollThreshold || DEFAULT_SCROLL_THRESHOLD,
  });

  return (
    <AppBar
      classes={{
        root: classes.root,
      }}
      className={trigger ? classes.rootCollapsed : undefined}
    >
      <Toolbar>
        <Typography
          variant="h6"
          className={classnames(
            classes.title, {
              [classes.titleCollapsed]: trigger,
            },
          )}
        >
          COVID-19 Visualization
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default withStyles(styles,
  { withTheme: true })(NavBar);
