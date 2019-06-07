import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import IconButton from '@material-ui/core/IconButton';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import compose from 'recompose/compose';
import { withValidate } from './validate';


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
            color: theme.palette.text.primary
        }
    },
    disabled:{}
});


function PasswordInput({label, classes, value, onChange, errorMessage, ...props}) {

    const [showPassword, setShowPassword ] = useState(false);

    return (
        <FormControl fullWidth className={classes.root}>
            <InputLabel>{ label }</InputLabel>

            <Input
                value={value}
                onChange={onChange}
                classes={{ underline: classes.underline, disabled: classes.disabled }}
                type={ showPassword ? 'text' : 'password' }
                {...props}
                endAdornment={<InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                        { showPassword ? <VisibilityOff /> : <Visibility /> }
                        </IconButton>
                    </InputAdornment>}
            />

            <FormHelperText className={classes.error}>{ errorMessage }</FormHelperText>
        </FormControl>
    );
}

PasswordInput.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles),
    withValidate
    ) (PasswordInput);