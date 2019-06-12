import React, { Fragment, useState, useCallback } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import { Form, Input, required, minLength } from '../UI/Forms';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';


const styles = theme => ({
    buttons: {
        margin: '0 -12px',
        width: 'calc(100% + 24px)'
    }
});

function CreateRoom({ classes, state, onClose, actions }) {

    const [roomName, setRoomName] = useState('');

    const onChange = useCallback( event => {
        const { value } = event.target;
        setRoomName(value);
    },[setRoomName]);

    const _onSubmit = useCallback(() => {
        actions.onSubmit({ room: roomName });
    },[roomName, actions]);

    return (
        <Fragment>
            <DialogTitle align="center">Create New Room</DialogTitle>
            <DialogContent>
                <Form onSubmit={_onSubmit}>
                    <Input
                        label="Room Name"
                        name="roomName"
                        onChange={onChange}
                        value={roomName}
                        validate={[required(), minLength(5)]} />

                    <Grid
                        className={classes.buttons}
                        container
                        justify="space-between"
                        alignItems="center">

                        <Button
                            style={{ textTransform: 'none' }}
                            onClick={actions.cancel}>Cancel</Button>
                        <Button
                            variant="outlined"
                            type="submit">Submit</Button>
                    </Grid>
                </Form>
            </DialogContent>
        </Fragment>
    );
}

CreateRoom.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CreateRoom);