import React, { PureComponent, Children, cloneElement } from 'react';
import { throttle } from './util';
import PropTypes from 'prop-types';

function withGroupValidation (WrappedComponent) {
    class WithGroupValidation extends PureComponent {

        state = {
            __showErrors: false,
            __isValid: false
        };

        componentDidMount() {
            this.calIsFormValid();
        }

        componentDidUpdate() {
            this.calIsFormValid();
        }

        calIsFormValid = throttle(() => {
            // this.state is a collection of input elements that are children of this component
            // reduce (this.state) into a true value if every input element isValid,
            // reduce (this.state) into a false value if one or more input elements current state is inValid.
            const isValid =
                Object.entries(this.state).filter(([key, value]) => key !== '__showErrors' && key !== '__isValid')
                    .reduce( (isValid, [key, inputIsValid]) => {
                        if(!inputIsValid)
                            return false;
                        return isValid;
                    }, true);

            // update parent elements state, if necessary
            if (isValid !== this.state.__isValid) {
                this.setState({
                    __isValid: isValid
                });
                if (typeof this.props.onValidate === 'function')
                    this.props.onValidate(isValid); // notify the parent
            }

        }, this.props.validateDelay);

        onInputValidate = this.onInputValidate.bind(this);
        onInputValidate({name, isValid}) {
            this.setState({
                [name]:isValid
            });
        }

        // remap children
        mapChildren = this.mapChildren.bind(this);
        mapChildren(children, depth = 0) {

            if (depth < this.props.searchDepth) { // limit search depth

                return Children.map(children, child => {

                    if (React.isValidElement(child)) {
                        if ('validate' in child.props) {
                            return cloneElement(child, {
                                onValidate: this.onInputValidate,
                                showErrors: this.state.__showErrors || this.props.showErrors
                            });
                        } else if (child.props.children) {
                            return cloneElement(child, {
                                children: this.mapChildren(child.props.children, depth + 1)
                            });
                        }
                    }
                    return child;
                });
            }
            return children;
        }

        onSubmit = this.onSubmit.bind(this);
        onSubmit(event) {
            event.preventDefault();
            const { __isValid } = this.state;
            if (__isValid) {
                this.props.onSubmit(event);
            } else {
                this.setState({
                    __showErrors: true
                });
            }
        }

        render() {
            const { isValid, children, onValidate, showErrors, validationDelay, searchDepth, onSubmit, ...props } = this.props;

            return (
                <WrappedComponent
                    children={ this.mapChildren(children) }
                    onSubmit={this.onSubmit}
                    {...props }
                />
            );
        }

        static get propTypes () {
            return {
                onValidate: function(props, propName, componentName) {
                    if(props[propName]) {
                        if (typeof props[propName] !== 'function')
                        {
                            return new Error(`${propName} can only be a function.`)
                        }
                        if (typeof props.isValid !== 'boolean')
                            return new Error('onValidate requires prop isValid to function correctly.');
                    }
                },
                isValid: PropTypes.bool, // is the form valid
                showErrors: PropTypes.bool, // show form errors
                validationDelay: PropTypes.number.isRequired,
                searchDepth: PropTypes.number.isRequired
            }
        }
        static get defaultProps() {
            return {
                validationDelay: 200,
                searchDepth: 2
            };
        }
    }

    return WithGroupValidation;
}

export default withGroupValidation;