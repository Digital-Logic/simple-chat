import socketIO from 'socket.io';

const users = {};

function create(server, options) {

    const io = socketIO(server, options);

    io.on('connection', function(socket) {

        socket.on('disconnect', () => {
            delete(users[socket.userHandle])
            socket.emit('Logout_success');
            updateUsers();
        });

        socket.on('message', ({ message, room }) => {
            io.emit('message', {
                user: socket.userHandle,
                message
            });
        });


        socket.on('user_exist', user => {
            socket.emit('user_exist', { [user]: !Boolean(users[user]) });
        });

        socket.on('create_user', user => {
            if (users[user]) {
                // user already exists, emit error
                socket.emit('user_create_failed', `User ${user} already exist.`);
            } else {
                users[user] = {};
                socket.userHandle = user;
                socket.emit('user_created', user);

                updateUsers();
            }
        });

        socket.on('log_out', () => {
            delete users[socket.userHandle];
            updateUsers();
        });

        function updateUsers() {
            io.emit('update_user_list', Object.keys(users));
        }
    });

    return io;
}

export default create;