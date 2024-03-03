import { updatePosts } from "./feedPosts.mjs";
import { API_BASE, API_KEY, API_SEARCH } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { displaySpinner } from "./feedPosts.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";

/** @typedef GetSocialPostDataResponse
 * @type {object} 
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media // null
 * @property {string} media.url
 * @property {string} media.alt
 * @property {string} created
 * @property {string} updated
 * @property {object} author
 * @property {string} author.name
 * @property {string} author.email
 * @property {null|string} author.bio
 * @property {object} author.avatar
 * @property {string} author.avatar.url
 * @property {string} author.avatar.alt
 * @property {object} author.banner
 * @property {string} author.banner.url
 * @property {string} author.banner.alt
 * @property {object} _count
 * @property {number} _count.comments
 * @property {number} _count.reactions
 */

/** @typedef  SocialPostMetaResponse
 * @type {object}
 * @property {boolean} isFirstPage
 * @property {boolean} isLastPage
 * @property {number} currentPage
 * @property {null} previousPage
 * @property {null} nextPage
 * @property {number} pageCount
 * @property {number} totalCount
 */

/** @typedef {object} GetSocialPostsResponse
 * @property {Array<GetSocialPostDataResponse>} data
 * @property {SocialPostMetaResponse} meta
 */

/**
 * @param {boolean} visible
 * @param {string|null} text
 */
function displayError(visible, text) {
    /** @type {HTMLDivElement} */
    const error = document.querySelector("#errorSearch");

    if (visible === true) {
        error.style.display = "block";
        error.innerHTML = text;
    } else {
        error.style.display = "none";
    }
}


let data = [];

/** @type {HTMLInputElement} */
const search = document.querySelector("#search");//input

/** @type {HTMLButtonElement} */
const btn = document.querySelector("#btn"); // button
btn.addEventListener("click", handleSearch);



async function handleSearch(ev) {
    ev.preventDefault();
    try {
        displaySpinner(true);

        /** @type {HTMLInputElement} */
        const txtFilter = document.querySelector("#filter");
        txtFilter.value = '';

        const text = search.value;

        if (text !== "") {
            const results = await searchPosts(text);
            console.log(results);

            if (!results) {
                // updatePosts([]);
                return;
            }
            updatePosts(results, '');
        }

    } catch (ev) {
        displayError(true, "Could not show the posts!");
    } finally {
        displaySpinner(false);
    }
}


/**
 * @description Returns all posts that does match the search text.
 * @param {string} text 
 * @returns {Promise<Array<GetSocialPostDataResponse|null|undefined>>}
 */
async function searchPosts(text) {

    try {
        displaySpinner(true);

        const url = API_BASE + API_SEARCH + encodeURIComponent(text);// text

        const response = await fetch(url, {

            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        debugger;

        if (response.ok) {

            /** @type {GetSocialPostsResponse} */
            const postsData = await response.json();
            data = postsData.data;

            return data;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();
        displayError(true, msg);

        return null;

    } catch (ev) {
        displayError(true, "Could not show the posts!");
    } finally {
        displaySpinner(false);
    }
}

