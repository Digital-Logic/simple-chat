import React from 'react';
import AppBarComponent from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const styles = theme => ({
    title: {
        fontWeight: 500,
        flexGrow: 1,
        textDecoration: 'none',
        cursor: 'default'
    }
});

function AppBar({ classes, logout, isAuthenticated }) {
    return (
        <AppBarComponent position="fixed">
            <Toolbar color="primary">
                <Typography variant="h4" className={classes.title}>Chat App</Typography>
                {
                    isAuthenticated ? <Button onClick={logout}>Logout</Button> : null
                }
            </Toolbar>
        </AppBarComponent>
    );
}

AppBar.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles)
)(AppBar);