import React, { Fragment } from 'react';
import AppBarComponent from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InvertColorIcon from '@material-ui/icons/InvertColors';
import classNames from 'classnames';

const styles = theme => ({
    title: {
        fontWeight: 500,
        flexGrow: 1,
        textDecoration: 'none',
        cursor: 'default'
    },
    color: {
        color: theme.palette.getContrastText(theme.palette.primary.main)
    }
});

function AppBar({ classes, logout, isAuthenticated, themeStyle, toggleTheme }) {
    return (
        <AppBarComponent position="fixed">
            <Toolbar color="primary">
                <Typography
                    variant="h4"
                    className={classNames(classes.color, classes.title)}>
                    Simple Chat</Typography>
                {
                    isAuthenticated ? (
                        <Fragment>
                            <IconButton className={classes.color} onClick={toggleTheme}><InvertColorIcon /></IconButton>
                            <Button className={classes.color} onClick={logout}>Logout</Button>
                        </Fragment>
                    ): null
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