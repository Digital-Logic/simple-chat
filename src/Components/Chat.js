import React, { Fragment, useState, useCallback, useEffect, useRef } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Forward';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import classNames from 'classnames';

const styles = theme => ({
    container: {
        width: '100%',
        height: '100%'
    },
    paper: {
        padding: 20,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    messageContainer: {
        width: '100%',
        flexGrow: 1,
        position: 'relative'
    },
    list: {
        flexGrow: 1,
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        overflowY: 'auto',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
            width: '0 !important'
        },
        scrollbarWidth: 'none'
    },
    textField: {
        flexGrow: 1
    },
    button: {
        width: '48px'
    }
});

function Chat({ joinRoom, sendMessage, messages, classes, className }) {

    const [message, setMessage] = useState('');
    const inputRef = useRef();
    const listRef = useRef();
    const listContainer = useRef();

    const onChange = useCallback(event => {
        const { name, value } = event.target;
        setMessage(value);
    },[]);

    const onSubmit = useCallback(event => {
        if (message.trim() !== '') {
            sendMessage(message);
            setMessage('');
        }
    }, [message]);

    const onEnterPress = useCallback(key => {
        const _key = key.which || key.key;
        if (_key === 13)
            onSubmit();

    },[onSubmit]);

    useEffect(() => {
        joinRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    // Auto scroll message list to display the new message.
    useEffect(() => {
        listContainer.current.scrollTop = listRef.current.clientHeight - listContainer.current.clientHeight;
    },[messages]);

    return (
        <div className={classNames(classes.container, className)}>
            <Paper className={classes.paper}>
                <div className={classes.messageContainer}>
                    <div className={classes.list} ref={listContainer}>
                        <List ref={listRef}>
                        {
                            messages.map(({user, message}, index) => (
                                <Fragment  key={index}>
                                    <ListItem alignItems="flex-start">
                                        <ListItemText
                                            primary={user}
                                            secondary={message}
                                        />
                                    </ListItem>
                                    <Divider />
                                </Fragment>
                            ))
                        }
                    </List>
                    </div>
                </div>
                <Grid container>
                    <Grid item className={classes.textField}>
                        <TextField
                            onKeyPress={onEnterPress}
                            inputRef={inputRef}
                            autoFocus
                            fullWidth
                            value={message}
                            onChange={onChange}/>
                    </Grid>
                    <Grid item className={classes.button}>
                        <IconButton onClick={onSubmit}><SendIcon /></IconButton>
                    </Grid>
                </Grid>

            </Paper>
        </div>
    );
}

Chat.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Chat);