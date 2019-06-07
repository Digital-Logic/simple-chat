import React from 'react';
import '../../Adapter.setup';
import { mount } from 'enzyme';

import { withValidate } from '../index';

jest.useFakeTimers();

describe("withValidation Test", () => {
    const Input = ({ errorMessage, ...props }) => (
        <div>
            <input { ...props} />
            <span>{ errorMessage }</span>
        </div>
    );
    const WrappedInput = withValidate(Input);
    var wrapper;
    var props;

    beforeEach(() => {
        props = {
            value: '',
            validate: jest.fn(() => 'ERROR'),
            showErrors: false,
            onChange: () => {  }
        };

        wrapper = mount(<WrappedInput { ...props } />);
        jest.runAllTimers();
    });

    it('Should mount', () => {
        expect(wrapper.find('input').length).toBe(1);
    });

    it('Should run validate methods on mount', () => {
        expect(props.validate.mock.calls.length).toBeGreaterThan(1);
    });

    it('Should show error message when input has been touched', () => {
        expect(props.validate.mock.calls.length).toBeGreaterThan(1);
        wrapper.setState({ touched: true });
        jest.runAllTimers();
        expect(props.validate.mock.calls.length).toBeGreaterThan(1);
        expect(wrapper.find(Input).prop('errorMessage')).toBe('ERROR');
        expect(wrapper.find('span').html()).toBe('<span>ERROR</span>');
    });

    it('Should show errors if showErrors prop is set to true', () => {
        // Input element is not displaying a error message
        expect(wrapper.find(Input).prop('errorMessage')).toBe('');
        wrapper.setProps({ showErrors: true });  // Set showErrors prop
        // Input element is now showing an error message.
        expect(wrapper.find(Input).prop('errorMessage')).toBe('ERROR');
    });
});