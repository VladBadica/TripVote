const events = {};

const subscribe = (event, handler) => {
    if (!events[event]) {
        events[event] = []
    }
    events[event].push(handler);
    return handler;
}

const unsubscribe = (event, handler) => {
    if (events[event]) {
        const index = events[event].findIndex(item => item === handler)
        events[event].splice(index, 1);
    }
}

const publish = (event, data) => {
    if (events[event]) {
        events[event].forEach(handler => handler(data));
    }
}

const PubSub = {
    subscribe,
    publish,
    unsubscribe
}

export default PubSub;