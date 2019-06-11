import socketIO from 'socket.io';

const users = {};

function create(server, options) {

    const io = socketIO(server, options);

    io.on('connection', function(socket) {

        socket.on('disconnect', () => {
            delete(users[socket.userHandle])
            socket.emit('LOGOUT_SUCCESS');
            updateUsers();
        });

        socket.on('MESSAGE_SENT', ({ message }) => {
            io.emit('MESSAGE_RECEIVED', {
                user: socket.userHandle,
                message
            });
        });


        socket.on('CHECK_USER_AVAILABLE_REQUEST', user => {
            socket.emit('CHECK_USER_AVAILABLE_RESPONSE', { [user]: !Boolean(users[user]) });
        });

        socket.on('CREATE_USER_REQUEST', user => {
            if (users[user]) {
                // user already exists, emit error
                socket.emit('CREATE_USER_FAILURE', `User ${user} already exist.`);
            } else {
                users[user] = {};
                socket.userHandle = user;
                socket.emit('CREATE_USER_SUCCESS', user);

                updateUsers();
            }
        });

        socket.on('LOG_OUT', () => {
            delete users[socket.userHandle];
            updateUsers();
        });

        function updateUsers() {
            io.emit('UPDATE_USER_LIST', Object.keys(users));
        }
    });

    return io;
}

export default create;