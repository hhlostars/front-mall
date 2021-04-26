export function debounce(callback, delay) {
    var timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            callback();
        }, delay);
    };
}