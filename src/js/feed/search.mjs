import { updatePosts } from "./feedPosts.mjs";
import { API_BASE, API_KEY, API_SEARCH } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { displaySpinner } from "./feedPosts.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";

// -------------------------2. types-----------------------------

/** @typedef {object} GetSocialPostsResponse
//  * @property {object[]} data
//  * @property {number} data.id
//  * @property {string} data.title
//  * @property {string} data.body
//  * @property {string[]} data.tags
//  * @property {object} data.media // null
//  * @property {string} data.media.url
//  * @property {string} data.media.alt
//  * @property {string} data.created
//  * @property {string} data.updated
//  * @property {object} data.author
//  * @property {string} data.author.name
//  * @property {string} data.author.email
//  * @property {null|string} data.author.bio
//  * @property {object} data.author.avatar
//  * @property {string} data.author.avatar.url
//  * @property {string} data.author.avatar.alt
//  * @property {object} data.author.banner
//  * @property {string} data.author.banner.url
//  * @property {string} data.author.banner.alt
//  * @property {object} data._count
//  * @property {number} data._count.comments
//  * @property {number} data._count.reactions
//  * @property {object} meta
//  * @property {boolean} meta.isFirstPage
//  * @property {boolean} meta.isLastPage
//  * @property {number} meta.currentPage
//  * @property {null} meta.previousPage
//  * @property {null} meta.nextPage
//  * @property {number} meta.pageCount
//  * @property {number} meta.totalCount
 */
// -------------------------3. function to handle error-----------------------------

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

// -------------------------4. function to handle searchbar-----------------------------

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

        const text = search.value;

        if (text !== "") {
            const results = await searchPosts(text);
            console.log(results);

            if (!results) {
                // updatePosts([]);
                return;
            }
            updatePosts(results);
        }

    } catch (ev) {
        displayError(true, "Could not show the posts!");
    } finally {
        displaySpinner(false);
    }
}

// -------------------------5. function to fetch search-----------------------------

/**
 * @description Returns all posts that does match the search text.
 * @param {string} text 
 * @returns {Promise<GetSocialPostsResponse["data"]|null|undefined>}
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

