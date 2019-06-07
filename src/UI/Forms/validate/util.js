function debounce(fn, timeToWait) {
    let timer = null;

    function executer(...args) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            fn(...args);
            timer = null;
        }, timeToWait);

    };
    // Provide a cancellation function attached to the executer.
    executer.cancel = () => clearTimeout(timer);

    return executer;
}

function throttle(fn, timeToWait) {
    let isThrottling = false;
    let timer = null;

    function executer(...args) {
        if (!isThrottling) {
            isThrottling = true;
            timer = setTimeout(() => {
                fn(...args);
                isThrottling = false;
            }, timeToWait);
        }
    }
    // Provide a cancellation function attached to the executer.
    executer.cancel = () => clearTimeout(timer);

    return executer;
}

export {
    debounce,
    throttle
};