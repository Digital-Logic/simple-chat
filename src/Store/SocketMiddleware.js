import io from 'socket.io-client';

const ACTIONS = Object.freeze({
    SUBSCRIBE: 'SOCKET_IO_SUBSCRIBE',
    UNSUBSCRIBE: 'SOCKET_IO_UNSUBSCRIBE',
    EMIT: 'SOCKET_IO_EMIT',
    EVENT_RECEIVED: 'SOCKET_IO_EVENT_RECEIVED'
});


function socketMiddleware() {
    const socket = io();

    return ({dispatch}) => next => action => {
        if (typeof action === 'function')
            return next(action);

        const { type, event, handle, data } = action;

        switch(type) {
            case ACTIONS.SUBSCRIBE:
                dispatch({ type: ACTIONS.SUBSCRIBE_SUCCESSFUL,
                    event,
                    handle: typeof handle === 'function' ? `function: ${handle.name}` : handle  });
                // All events captured by socket.io will be dispatched through redux as of
                // type: SOCKET_IO_EVENT_RECEIVED
                return socket.on(event, typeof handle === 'function' ? handle : defaultHandle);

            case ACTIONS.UNSUBSCRIBE:
                dispatch({ type: 'SOCKET_IO_UNSUBSCRIBE_EVENT',
                    event,
                    handle: typeof handle === 'function' ? `function: ${handle.name}` : handle });
                // the handle must resolve to the same function that was used to register the event.
                return socket.removeListener(event, typeof handle === 'function' ? handle : defaultHandle);

            case ACTIONS.EMIT:
                dispatch({ type: 'SOCKET_IO_EMIT_EVENT', event, data});
                return socket.emit(event, data);

            default:
                return next(action);
        }

        function defaultHandle(data) {
            dispatch({ type: 'SOCKET_IO_SUBSCRIBE_EVENT', event, data });
        }
    };
}



export {
    socketMiddleware,
    ACTIONS as SOCKET_ACTIONS
};