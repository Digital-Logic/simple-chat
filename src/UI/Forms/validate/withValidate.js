import React, { Component } from 'react';
import { debounce } from './util';
import PropTypes from 'prop-types';

function withValidate(WrappedComponent) {

    class WithValidate extends Component {
        state = {
            touched: false,
            errorMessage: ''
        };

        componentDidMount() {
            this.checkValidation();
        }

        componentDidUpdate() {
            this.checkValidation();
        }

        componentWillUnmount() {
            this.checkValidation.cancel();
        }

        shouldComponentUpdate(nextProps, nextState) {
            // Has internal state changed
            for (let [key, value] of Object.entries(nextState)) {
                if (this.state[key] !== value)
                    return true;
            }

            // has props changed, excluding validate methods
            for (let [key, value] of Object.entries(nextProps)) {
                if (key !== 'validate' && this.props[key] !== value)
                    return true;
            }

            // Props and state have not changed, are the validation methods pure functions, or do they
            // depend on external state.

            if (Array.isArray(nextProps.validate)) {
                return nextProps.validate.reduce( (notPure, v) => {
                    if (!v.pure)
                        return true;
                    return notPure;
                }, false);
            } else if (nextProps.validate) {
                return !nextProps.validate.pure;
            }

            return false;
        }

        checkValidation = debounce(() => {
            // no validators exist, exit
            if (this.props.validate == null) return;

            // Normalize validate to an Array of validator functions.
            const validators =
                Array.isArray(this.props.validate) ? this.props.validate : [this.props.validate]
                .filter( validator => typeof validator === 'function');

            const { value } = this.props;

            const errorMessage = validators.reduce( ( message, validate) => {
                if (message)
                    return message;
                else return validate(value);
            }, '');

            // Update the state, if the errorMessage has changed
            if (errorMessage !== this.state.errorMessage ) {

                this.setState({
                    errorMessage
                });
                // notify withGroupValidation of input elements validation state change
                if (this.props.onValidate) {
                    this.props.onValidate({
                        name: this.props.name,
                        isValid: errorMessage === ''
                    });
                }
            }
        }, this.props.validationDelay);

        onBlur = this.onBlur.bind(this);
        onBlur(event) {
            if (this.state.touched === false) {
                this.setState({ touched: true });
            }
            // propagate onBlur event if event handler was passed into this component
            if (typeof this.props.onBlur === 'function')
                this.props.onBlur(event);
        }

        render() {
            const { validate, onBlur, onValidate, showErrors, validationDelay, ...props } = this.props;
            const { touched, errorMessage } = this.state;

            return (
                <WrappedComponent { ...props }
                    onBlur={ this.onBlur }
                    errorMessage={ touched || showErrors ?  errorMessage : '' }/>
            );
        }

        static get propTypes() {
            return {
                validate: PropTypes.oneOfType([
                    PropTypes.func,
                    PropTypes.arrayOf(PropTypes.func)
                ]),
                showErrors: PropTypes.bool,
                validationDelay: PropTypes.number.isRequired
            };
        }

        static get defaultProps() {
            return {
                validationDelay: 200
            };
        }
    }

    return WithValidate;
}

export default withValidate;
