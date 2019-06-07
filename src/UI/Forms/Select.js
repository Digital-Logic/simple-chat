import React from 'react';
import Select from '@material-ui/core/Select';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
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
        }
    },
    disabled:{}
});

const InputComponent = withStyles(styles)(Input);

function SelectComponent({ classes, label, name, onChange, value, errorMessage, children, ...props }) {
    return (
        <Grid item>
            <FormControl fullWidth>
                <InputLabel>{ label }</InputLabel>
                <Select
                    input={ <InputComponent name={name} value={value}/> }
                    onChange={onChange}
                    {...props}>
                { children }
                </Select>
                <FormHelperText className={classes.error}>{ errorMessage }</FormHelperText>

            </FormControl>
        </Grid>
    );
}

SelectComponent.propTypes = {
    classes: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    errorMessage: PropTypes.string
};

export default compose(
    withStyles(styles),
    withValidate,
)(SelectComponent);