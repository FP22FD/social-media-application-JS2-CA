/**
 * @description Display a message error
 * @method displayError
 * @param {boolean} visible If true, shows the msg error, otherwise hides it.
 * @param {string} id Show error msg by id
 * @param {string} [text]  The message to show, or `undefined` if `visible` is false.
 */
export function displayError(visible, id, text) {
    /** @type {HTMLDivElement} */
    const error = document.querySelector(id);

    if (!error) {
        return;
    }

    if (visible === true) {
        error.style.display = "block";
        error.innerHTML = text;
    } else {
        error.style.display = "none";
    }
}