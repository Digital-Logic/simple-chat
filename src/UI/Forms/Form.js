import React from 'react';
import { withGroupValidation } from './validate';

function Form (props) {
    return (
        <form { ...props }/>
    );
}

export default withGroupValidation(Form);