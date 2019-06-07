import React from 'react';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    progress: {
        margin: '15px'
    },
    root: {
        minHeight: '85px'
    }
});

function Progress () {
    return (
        <Grid container justify="center" alignItems="center">
            <CircularProgress
                size={60}
                thickness={2}
                />
        </Grid>
    );
}

Progress.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Progress);