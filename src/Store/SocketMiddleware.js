import io from 'socket.io-client';

const ACTIONS = Object.freeze({
    SUBSCRIBE: 'SOCKET_IO_SUBSCRIBE',
    UNSUBSCRIBE: 'SOCKET_IO_UNSUBSCRIBE',
    EMIT: 'SOCKET_IO_EMIT',
    EMIT_EVENT: 'SOCKET_IO_EMIT_EVENT',
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
                dispatch({ type: 'SOCKET_IO_SUBSCRIBE_EVENT',
                    event,
                    handle: typeof handle === 'function' ? `function: ${handle.name}` : handle  });
                // All events captured by socket.io will be dispatched through redux as
                // type: SOCKET_IO_EVENT_RECEIVED
                const onEvent = typeof handle === 'function' ? handle : defaultHandle(event);
                socket.on(event, onEvent);
                return onEvent;

            case ACTIONS.UNSUBSCRIBE:
                dispatch({ type: 'SOCKET_IO_UNSUBSCRIBE_EVENT',
                    event,
                    handle: typeof handle === 'function' ? `function: ${handle.name}` : handle });
                if (typeof handler !== 'function')
                    throw new Error(`Unable to unsubscribe to ${event}, without a function reference.`);
                // the handle must resolve to the same function that was used to register the event.
                socket.removeListener(event,  handle);
                break;

            case ACTIONS.EMIT:
                dispatch({ type: ACTIONS.EMIT_EVENT, event, data});
                return socket.emit(event, data);

            default:
                return next(action);
        }

        function defaultHandle(event) {
            return data => dispatch({ type: ACTIONS.EVENT_RECEIVED, event, data });
        }
    };
}



export {
    socketMiddleware,
    ACTIONS as SOCKET_ACTIONS
};