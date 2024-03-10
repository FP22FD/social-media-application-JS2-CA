import { API_KEY, API_BASE, API_POSTS } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";

/**
 * @description Show or hide a error message in the UI.
 * @method displayError
 * @param {number} id Post id
 * @param {boolean} visible If true, shows the msg error, otherwise hides it.
 * @param {string} [text] The message to show, or null if `visible` is false.
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
 * @description Delete user post
 * @async
 * @function fetchDeletePost
 * @param {number} id The post ID to be deleted.
 * @returns {Promise<boolean|null|undefined>} If response is ok, delete the post and return true. If response is not ok, return null. Returns undefined for unexpected errors.
 */
export async function fetchDeletePost(id) {

    displaySpinner(true, "#spinnerPosts");
    displayError(id, false);

    try {
        const url = API_BASE + API_POSTS + `/${id}`;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "DELETE",
        });

        if (response.ok) {
            return true;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();
        displayError(id, true, msg);

        return null;

    } catch (ev) {
        displayError(id, true, "Could not show the post! Please retry later.");
    } finally {
        displaySpinner(false, "#spinnerPosts");
    }
}