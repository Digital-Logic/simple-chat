import React, { useReducer, useCallback, useRef, required, minLength } from 'react';
import { Form, Input} from '../UI/Forms';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

const ELEMENT = Object.freeze({
    NAME: 'name'
});

const initialState = {
    name: ''
};

function NewUser() {

    const [{ name }, dispatch] = useReducer(reducer, initialState);
    const formRef = useRef();

    const onChange = useCallback(event => {
        const { name, value } = event.target;
        dispatch({
            type: name,
            value
        });
    });

    return (
        <Form ref={formRef} onSubmit={onSubmit}>
            <Input
                label="Create Your Handle"
                name={ELEMENT.NAME}
                value={name}
                onChange={onChange}/>
            <Grid container justify="flex-end">
                <Button
                    style={{ margin: '0 -12px'}}
                    variant="outlined"
                    type="submit"
                    >Submit</Button>
            </Grid>

        </Form>
    );
}

function onSubmit() {
    console.log('Submitting data!');
}

function reducer(state, { type, value }) {
    return {
        ...state,
        [type]: value
    };
}

export default NewUser;
