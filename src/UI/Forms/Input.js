import React from 'react';
import PropTypes from 'prop-types';
import withValidate from './validate/withValidate';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';


const styles = theme => ({
    error: {
        color: theme.palette.error.main
    },
    underline: {
        '&$disabled': {
            '&:before': {
                borderBottomStyle: 'solid'
            }
        }
    },
    root: {
        '&$disabled': {
        }
    },
    disabled:{}
});

function InputComponent({label, classes, value, onChange, errorMessage, ...props}) {
    return (
        <FormControl fullWidth className={classes.root}>
            <InputLabel>{ label }</InputLabel>
            <Input
                classes={{ underline: classes.underline, disabled: classes.disabled }}
                value={value}
                onChange={onChange}
                {...props }/>
            <FormHelperText className={classes.error}>{ errorMessage }</FormHelperText>
        </FormControl>
    );
}

InputComponent.propTypes = {
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
    errorMessage: PropTypes.string,
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles),
    withValidate
)(InputComponent);