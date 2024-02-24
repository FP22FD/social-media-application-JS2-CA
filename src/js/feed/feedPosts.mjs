// ---------------------------1. settings------------------------
// document.body.style.backgroundColor = "red";

import { API_KEY, API_BASE, API_POSTS, API_GET_POSTS_PARAMS } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { sanitize } from "../shared/sanitize.mjs";

// -------------------------2. types-----------------------------

/** @typedef {object} GetSocialPostsResponse
 * @property {object[]} data
 * @property {number} data.id
 * @property {string} data.title
 * @property {string} data.body
 * @property {string[]} data.tags
 * @property {object} data.media // null
 * @property {string} data.media.url
 * @property {string} data.media.alt
 * @property {string} data.created
 * @property {string} data.updated
 * @property {object} data.author
 * @property {string} data.author.name
 * @property {string} data.author.email
 * @property {null|string} data.author.bio
 * @property {object} data.author.avatar
 * @property {string} data.author.avatar.url
 * @property {string} data.author.avatar.alt
 * @property {object} data.author.banner
 * @property {string} data.author.banner.url
 * @property {string} data.author.banner.alt
 * @property {object} data._count
 * @property {number} data._count.comments
 * @property {number} data._count.reactions
 * @property {object} meta
 * @property {boolean} meta.isFirstPage
 * @property {boolean} meta.isLastPage
 * @property {number} meta.currentPage
 * @property {null} meta.previousPage
 * @property {null} meta.nextPage
 * @property {number} meta.pageCount
 * @property {number} meta.totalCount
 */

/** @type {GetSocialPostsResponse["data"]} */
let data = [];

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

// -------------3. Function to handle user key -------------------------//

// /**
//  * @param {string} key
//  */
// function load(key) {
//   const storedKey = localStorage.getItem(key);
//   const value = storedKey ? JSON.parse(storedKey) : null;
//   return value;
// }

// ---------------4. Function to display error messages------------------//

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

// -----------------6. Function to display spinner-------------------------//

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

// -------------5. Function to display posts -------------------------

export async function displayPosts() {
  try {
    displaySpinner(true);

    const url = API_BASE + API_POSTS + API_GET_POSTS_PARAMS;

    const response = await fetch(url, {

      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json", //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
      },
      method: "GET",
    });

    // debugger;

    if (response.ok) {

      /** @type {GetSocialPostsResponse} */
      const postsData = await response.json();
      data = postsData.data;

      updatePosts(data);
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

// -------------6. Function to sanitize inputs innerHTML --------------

// /** @param {string} html */
// function sanitize(html) {
//   // @ts-ignore
//   return DOMPurify.sanitize(html);
// }

// -------------6. Function to update posts -------------------------

/**
 * @param {GetSocialPostsResponse["data"]} data
*/
export async function updatePosts(data) {

  /** @type {HTMLDivElement} */
  const posts = document.querySelector("#posts");
  posts.innerHTML = "";

  if (data.length === 0) {
    posts.innerHTML = "No posts found!";
  } else {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];


      /** @type {HTMLTemplateElement} */
      const template = document.querySelector("#post");

      const post = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

      post.querySelector("h5").innerText = item.author.name + item.id; // + item.id

      /** @type {HTMLImageElement} */
      const authorImg = post.querySelector("#authorImg");
      authorImg.src = item.author.avatar.url;

      /** @type {HTMLImageElement} */
      const img = post.querySelector("#postImg");
      if (item.media) {
        img.src = item.media.url;
        img.alt = item.media.alt;
      } else {
        img.style.display = "none";
      }

      post.querySelector("#bodyTitle").innerHTML = sanitize(item.title);
      post.querySelector("#bodyPost").innerHTML = sanitize(item.body);

      let date = new Date(item.created);

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

      posts.appendChild(post);
    }
  }


}

// displayPosts().then(console.log);
displayPosts();




// ----------------------to do: sort filter----------------------------

// document.querySelector("#orderBy").addEventListener("change", handleOrderBy);

// function handleOrderBy(event) {
//   const oby = event.target.value;

//   if (oby === "name") {
//     data.sort((a, b) => (a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1));
//   }
//   updatePosts(data);
// }