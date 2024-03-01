import { API_KEY, API_BASE, API_POSTS } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displaySpinner } from "./profile.mjs";


/** @typedef {object} deletePostResponse
 * @property {object} data
 * @property {number} data.id
 * @property {string} data.title
 * @property {string} data.body
 * @property {string[]} data.tags
 * @property {object} data.media
 * @property {string} data.media.url
 * @property {string} data.media.alt
 * @property {string} data.created
 * @property {string} data.updated
 * @property {object} data.author
 * @property {string} data.author.name
 * @property {string} data.author.email
 * @property {null} data.author.bio
 * @property {object} data.author.avatar
 * @property {string} data.author.avatar.url
 * @property {string} data.author.avatar.alt
 * @property {object} data.author.banner
 * @property {string} data.author.banner.url
 * @property {string} data.author.banner.alt
 * @property {object} data._count
 * @property {number} data._count.comments
 * @property {number} data._count.reactions
 */

/**
 * @param {number} id
 * @param {boolean} visible
 * @param {string|null} text
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

/** @type {deletePostResponse["data"]} */
let data = undefined;


/**
 * @param {number} id
 */
export async function fetchDeletePost(id) {

    displaySpinner(true);

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
        displaySpinner(false);
    }
}