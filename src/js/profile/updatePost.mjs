import { API_KEY, API_BASE, API_POSTS } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displaySpinner } from "./profile.mjs";

/** @typedef {object} UpdatePostRequest
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media
 * @property {string} media.url
 * @property {string} media.alt
 */

/**
 * @description Show or hide a error message in the UI.
 * @method displayError
 * @param {number} id Retrieves a single post by ID to display error
 * @param {boolean} visible If true, shows the msg error, otherwise hides it.
 * @param {string} [text] The message to show, or `undefined` if `visible` is false.
 */
function displayError(id, visible, text) {
    /** @type {HTMLDivElement} */
    const error = document.querySelector(`article[data-id="${id}"] #errorMsg`);

    if (visible === true) {
        error.classList.add("d-flex")
        error.classList.remove("d-none")

        error.innerHTML = text;
    } else {
        error.classList.remove("d-flex")
        error.classList.add("d-none")
    }
}

/**
 * @param {number} id
 * @param {UpdatePostRequest} putData
 */
export async function fetchUpdatePost(id, putData) {

    displaySpinner(true);

    try {
        const url = API_BASE + API_POSTS + `/${id}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify(putData),
        });

        if (response.ok) {
            return true;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();
        displayError(id, true, msg);

        return null;
    } catch (ev) {
        displayError(id, true, "Could not update the post! Please retry later.");
    } finally {
        displaySpinner(false);
    }
}