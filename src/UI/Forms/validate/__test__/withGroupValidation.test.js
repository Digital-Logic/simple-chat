import React, { Component } from 'react';
import '../../Adapter.setup';
import { mount } from 'enzyme';

import { withGroupValidation, withValidate, required } from '../index';

jest.useFakeTimers();

describe("withGroupValidation: Testing hoc group validation component", () => {

    var component,
        onValidate;

    beforeAll(() => {
        component = mount( <FormWrapper /> );   // the definition of <FormWrapper /> is at the end of this file
        onValidate = component.instance().onValidate;  // reference to the onValidate method
        jest.runAllTimers();
    });

    afterEach(() => {
        onValidate.mockClear(); // clear stored data within function mock
    });

    it('Should mount, isValid should be false', () => {
        expect(component.find('form').length).toBe(1);
        expect(component.find(InputComponent).length).toBe(3);
        // onValidate gets call when the component is mounted to find out each elements validation state
        // and share that info the the parent component.
        expect(component.state('isValid')).toBe(false);
    });

    it('Should update isValid state when input elements are valid', () => {
        component.setState({ input1: 'a'});
        expect(onValidate.mock.calls.length).toBe(0);
        expect(component.state('isValid')).toBe(false);
        component.setState({input2: 'b'});
        component.setState({input3: 'c'})
        jest.runAllTimers();
        expect(onValidate.mock.calls.length).toBe(1);
        expect(component.state('isValid')).toBe(true);
    });

    it('Should update isValid state when input elements are not valid', () => {
        expect(onValidate.mock.calls.length).toBe(0);
        expect(component.state('isValid')).toBe(true);
        component.setState({input1: ''});
        jest.runAllTimers();
        expect(onValidate.mock.calls.length).toBe(1);
        expect(component.state('isValid')).toBe(false);
    });

    it('Should pass showErrors value to children', () => {
        component.find(InputComponent).map( (input) => expect(input.prop('showErrors')).toBe(false));
        component.setState({ showErrors: true});
        // ShowErrors props updates to children components
        component.find(InputComponent).map( input => expect(input.prop('showErrors')).toBe(true) );
    });
});

it('withGroupValidation will not crash when no children are present', () => {
    const FormWrapper = () => ( <div><Form isValid={false} onValidate={ (isValid) => {} } /></div> );
    const component = mount( <FormWrapper />);
    expect(component.find(Form).length).toBe(1);
});


const Input = ({errorMessage}) => (
    <div>
        <input />
        <span>{ errorMessage }</span>
    </div>
);

const InputComponent = withValidate(Input);

const Form = withGroupValidation( (props) => (
    <form {...props} />
));

class FormWrapper extends Component {
    state = {
        input1: '',
        input2: '',
        input3: '',
        isValid: false,
        showErrors: false
    };

    onValidate = jest.fn( isValid => this.setState({isValid}) );

    render() {
        return (
            <Form isValid={ this.state.isValid } onValidate={ this.onValidate } showErrors={this.state.showErrors} >
                <InputComponent
                    validate={ required('ERROR') }
                    name="input1"
                    value={this.state.input1}
                    onChange={ event => this.setState({ input1: event.target.value}) }
                />

                <InputComponent
                    validate={[ required('ERROR') ]}
                    name="input2"
                    value={this.state.input2}
                    onChange={ event => this.setState({ input2: event.target.value }) }
                />

                <div>
                    <InputComponent
                        validate={[ required('ERROR') ]}
                        name="input3"
                        value={this.state.input3}
                        onChange={ event => this.setState({ input2: event.target.value }) }
                    />
                </div>

            </Form>
        );
    }
}