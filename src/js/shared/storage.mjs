/**
 * @param {string} key
 */
export function load(key) {
    const storedKey = localStorage.getItem(key);
    const value = storedKey ? JSON.parse(storedKey) : null;
    return value;
}

/**
 * @param {string} key
 * @param {(string|object)} value
 */
export function save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param {string} key
 */
export function remove(key) {

    localStorage.removeItem(key);
}