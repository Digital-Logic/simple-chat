import React, { Fragment, useRef, useCallback } from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import NewUserForm from '../Forms/NewUser';

function NewUserModel({ state, onClose }) {


    return (
        <Fragment>
            <DialogTitle align="center">Create Handle</DialogTitle>
            <DialogContent>
                <NewUserForm onClose={onClose}/>
            </DialogContent>
        </Fragment>
    );
}

export default NewUserModel;