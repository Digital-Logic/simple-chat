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
                dispatch({ type: `SUBSCRIBE ${event}`,
                    event,
                    handle: typeof handle === 'function' ? `function: ${handle.name}` : handle  });
                // All events captured by socket.io will be dispatched through redux
                const eventHandler = typeof handle === 'function' ? handle : defaultHandle(event);
                socket.on(event, eventHandler);
                // return the event handler, so the caller can unsubscribe from the event.
                return eventHandler;

            case ACTIONS.UNSUBSCRIBE:
                dispatch({ type: `UNSUBSCRIBE ${event}`, event });

                if (typeof handle !== 'function')
                    throw new Error(`Unable to unsubscribe to ${event}, without a function reference.`);
                // the handle must resolve to the same function that was used to register the event.
                socket.removeListener(event,  handle);
                break;

            case ACTIONS.EMIT:
                dispatch({ type: event, data});
                return socket.emit(event, data);

            default:
                return next(action);
        }

        function defaultHandle(event) {
            return data => dispatch({ type: event, data });
        }
    };
}



export {
    socketMiddleware,
    ACTIONS as SOCKET_ACTIONS
};