import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    root: {
        overflow: 'hidden'
    },
    progress: {
        margin: '10px'
    }
});

function Progress ({ classes }) {
    return (
        <Grid
            container
            className={classes.root}
            justify="center"
            alignItems="center">
            <CircularProgress
                className={classes.progress}
                size={70}
                thickness={2}
                />
        </Grid>
    );
}

Progress.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Progress);