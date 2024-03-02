import { API_BASE, API_POSTS, API_GET_POSTS_PARAMS, API_KEY } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { sanitize } from "../shared/sanitize.mjs";


/** @typedef {object} GetSinglePostResponse
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


/** @type {GetSinglePostResponse["data"]} */
let data = undefined;

//https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams/get
const queryString = document.location.search;
const params = new URLSearchParams(queryString);
const id = parseInt(params.get("id"), 10);

/**
 * @param {number} id
 */
async function fetchSinglePost(id) {

    displaySpinner(true);

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

        // debugger;

        /** @type {GetSinglePostResponse} */
        const postData = await response.json();
        const data = postData.data;

        console.log(data);

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
        displayError(true, "Could not show the post! Please retry later.");
    } finally {
        displaySpinner(false);
    }
}

fetchSinglePost(id);


/**
 * @param {boolean} visible
 * @param {string} text
 */
export function displayError(visible, text) {
    /** @type {HTMLDivElement} */
    const error = document.querySelector("#errorPosts");

    if (visible === true) {
        error.style.display = "block";
        error.innerHTML = text;
    } else {
        error.style.display = "none";
    }
}


/**
 * @param {boolean} spinnerVisible
 */
export function displaySpinner(spinnerVisible) {
    /** @type {HTMLDivElement} */
    const spinner = document.querySelector("#spinnerPosts");


    if (spinnerVisible === true) {
        spinner.style.display = "block";
    } else {
        spinner.style.display = "none";
    }
}

displaySpinner(false);
