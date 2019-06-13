import React, { useEffect } from 'react';
import compose from 'recompose/compose';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import ScrollPaper from './ScrollPaper';
import { userActions } from '../Store';

const styles = theme => ({
    container: {

    }
});

function UserList ({ users, subscribeUserList, unsubscribeUserList }) {

    useEffect(() => {
        const eventHandler = subscribeUserList();
        return () => {
            unsubscribeUserList(eventHandler);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    return (
        <ScrollPaper>
                <List>
                    <Typography variant="subtitle2" align="center">Users</Typography>
                {
                    Object.entries(users).map(([user, data]) => (
                        <ListItem key={user}>
                            <ListItemText>{ user }</ListItemText>
                        </ListItem>
                    ))
                }
                </List>
        </ScrollPaper>
    );
}

UserList.propTypes = {
    classes: PropTypes.object.isRequired
}

function mapState(state) {
    return {
        users: state.users
    };
}

function mapDispatch(dispatch) {
    return {
        subscribeUserList: () => dispatch(userActions.subscribeUserList()),
        unsubscribeUserList: (handle) => dispatch(userActions.unsubscribeUserList(handle))
    };
}


export default compose(
    withStyles(styles),
    connect(mapState, mapDispatch)
)(UserList);