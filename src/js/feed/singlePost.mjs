import { API_BASE, API_POSTS, API_GET_POSTS_PARAMS, API_KEY } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { checkUserAuth } from "../shared/checkUserAuth.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";

/** @typedef GetSinglePostDataResponse
 * @type {object} 
 * @property {number} id
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media
 * @property {string} media.url
 * @property {string} media.alt
 * @property {string} created
 * @property {string} updated
 * @property {object} author
 * @property {string} author.name
 * @property {string} author.email
 * @property {null} author.bio
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

/** @typedef {object} GetSinglePostResponse
 * @property {GetSinglePostDataResponse} data
 */

// /** @type {Array<GetSinglePostDataResponse>} */
// let data = undefined;

checkUserAuth();

//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id"), 10);

/**
 * @description Send a request to show a post details to the user.
 * @async
 * @method fetchSinglePost
 * @param {number} id Post ID
 */
async function fetchSinglePost(id) {

    displaySpinner(true, "#spinnerPosts");
    displayError(false, "#errorPosts");

    try {
        const url = API_BASE + API_POSTS + `/${id}` + API_GET_POSTS_PARAMS;
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        /** @type {GetSinglePostResponse} */
        const postData = await response.json();
        const data = postData.data;

        /** @type {HTMLTemplateElement} */
        const template = document.querySelector("#post");
        const post = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

        /** @type {HTMLImageElement} */
        const authorImg = post.querySelector("#authorImg");
        authorImg.src = data.author.avatar.url;

        post.querySelector("h5").innerText = data.author.name;

        let date = new Date(data.created);
        /** @type Intl.DateTimeFormatOptions */
        const options = {
            // weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        // `BCP 47 language tag` => no-NO
        let dateString = date.toLocaleDateString("no-NO", options);
        post.querySelector("#datePost").innerHTML = dateString;

        post.querySelector("#bodyTitle").innerHTML = sanitize(data.title);
        post.querySelector("#bodyPost").innerHTML = sanitize(data.body);

        /** @type {HTMLImageElement} */
        const img = post.querySelector("#postImg");
        if (data.media) {
            img.src = data.media.url;
            img.alt = data.media.alt;
        } else {
            img.style.display = "none";
        }

        post.querySelector("#alt-img").innerHTML = sanitize(data.media.alt);

        const posts = document.querySelector("#posts");
        posts.appendChild(post);

    } catch (ev) {
        displayError(true, "#errorPosts", "Could not show the post! Please retry later.");
    } finally {
        displaySpinner(false, "#spinnerPosts");
    }
}

fetchSinglePost(id);
