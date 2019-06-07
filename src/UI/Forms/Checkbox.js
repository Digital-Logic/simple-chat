import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { withStyles } from '@material-ui/core/styles';
import { withValidate } from './validate';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

const styles = theme => ({
    color: {
    },
    disabled: {
    },
    checked: {
        '&$disabled': {
            color: theme.palette.primary.light
        },
        '&$color': {
            color: theme.palette.primary.light
        }
    }
});

function CheckboxComponent({ classes, label, name, value, onChange, disabled, errorMessage, ...props}) {
    return (
        <FormControlLabel
            control={
                <Checkbox
                    classes={{
                        colorPrimary: classes.color,
                        disabled: classes.disabled,
                        checked: classes.checked
                    }}
                    onChange={(event) => onChange({
                        // transform output so that the signature is simular to other input components.
                        target: {
                            name,
                            value: event.target.checked
                        }
                    })}
                    disabled={disabled}
                    color="primary"
                    checked={value} />
                }
            label={label}
        />
    );
}

CheckboxComponent.propTypes = {
    classes: PropTypes.object.isRequired
};

export default compose(
    withStyles(styles),
    withValidate
)(CheckboxComponent);