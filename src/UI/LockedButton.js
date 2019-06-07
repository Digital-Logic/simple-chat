import React from 'react';
import Button from '@material-ui/core/Button';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const styles = theme => ({
    icon: {
        marginRight: theme.spacing.unit
    }
});

function LockedButton({ locked, onClick, classes, children }) {
    return (
        <Button onClick={onClick}>
        { locked ? <LockIcon fontSize="small" className={classes.icon}/> : <LockOpenIcon fontSize="small" className={classes.icon} /> }
        { children }
        </Button>
    );
}

LockedButton.propTypes = {
    classes: PropTypes.object.isRequired,
    locked: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired
};

export default withStyles(styles)(LockedButton);