import React, { Fragment } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import NewUserForm from '../Forms/NewUser';

function NewUserModel({ state, onClose, actions }) {

    return (
        <Fragment>
            <DialogTitle align="center">Create Your Handle</DialogTitle>
            <DialogContent>
                <NewUserForm onClose={onClose}/>
            </DialogContent>
        </Fragment>
    );
}

export default NewUserModel;