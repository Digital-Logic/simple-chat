import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
    grid: {
        height: '100%',
        position: 'relative'
    },
    paper: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        overflow: 'auto'
    }
});


function ScrollPaper({ classes, children, className }) {
    return (
        <Grid container direction="column" className={classes.grid}>
            <Paper elevation={5} className={classNames(classes.paper, className)}>
            {
                children
            }
            </Paper>
        </Grid>
    );
}

ScrollPaper.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string
};

export default withStyles(styles)(ScrollPaper);