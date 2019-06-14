import socketIO from 'socket.io';
const ROOMS = ['general', 'computers', 'cats & dogs'];
const users = {};

const rooms = ROOMS.reduce((acc, cur) => {
    acc[cur] = 0;
    return acc;
},{});

function create(server, options) {

    const io = socketIO(server, options);

    io.on('connection', function(socket) {

        socket.on('disconnect', () => {
            leaveRoom();
            updateRoomList();
            delete(users[socket.userHandle]);
            socket.emit('LOGOUT_SUCCESS');
            updateUsers();
        });

        socket.on('MESSAGE_SENT', ({ message }) => {
            // Emit message to all clients in current room, including sender
            io.to(socket.room).emit('MESSAGE_RECEIVED', {
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

        function leaveRoom() {
            if (socket.room) {
                socket.leave(socket.room);
                // decrement room counter for old room
                --rooms[socket.room];
                // No one is in the room, remove it
                if (!ROOMS.includes(socket.room) && rooms[socket.room] === 0) {
                    delete rooms[socket.room];
                    return true;
                }
            }
            return false;
        }

        socket.on('JOIN_ROOM_REQUEST', room => {

            if (typeof room !== 'string' || room.trim() === '') {
                socket.emit('JOIN_ROOM_FAILURE', `Invalid room name: ${room}`);
                return;
            }
            room = room.toLowerCase();

            // create room key in rooms object
            if (!rooms[room]) {
                rooms[room] = 0;
            }
            // Increment room counter
            ++rooms[room];

            leaveRoom();

            socket.room = room;
            socket.join(room);

            socket.emit('JOIN_ROOM_SUCCESS', room);

            updateRoomList();
        });

        socket.on('UPDATE_ROOMS_LIST_REQUEST', () => {
            updateRoomList();
        });

        socket.on('LOG_OUT', () => {
            leaveRoom();
            updateRoomList;
            socket.room = '';
            delete users[socket.userHandle];
            updateUsers();
        });

        function updateRoomList() {
            io.emit('UPDATE_ROOMS_LIST', rooms);
        }

        function updateUsers() {
            io.emit('UPDATE_USER_LIST', Object.keys(users));
        }
    });

    return io;
}

export default create;