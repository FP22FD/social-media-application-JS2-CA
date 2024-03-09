import { API_KEY, API_BASE, API_POSTS, API_GET_POSTS_PARAMS } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { checkUserAuth } from "../shared/checkUserAuth.mjs";

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

/** @typedef  GetSocialPostMetaResponse
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
 * @property {GetSocialPostDataResponse[]} data
 * @property {GetSocialPostMetaResponse} meta
 */

/** @type {Array<GetSocialPostDataResponse>} */
let data = [];

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

checkUserAuth();

/**
 * @description Display a message error
 * @method displayError
 * @param {boolean} visible If true, shows the msg error, otherwise hides it.
 * @param {string} [text]  The message to show, or `undefined` if `visible` is false.
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
 * @description Show and hide the spinner element
 * @method displaySpinner
 * @param {boolean} spinnerVisible If true, shows the spinner, otherwise hides it.
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

/**
 * @description Send a request to get the user posts
 * @async
 * @function displayPosts
 * @returns {Promise<GetSocialPostDataResponse[]|null|undefined>} If response is ok, return posts data. If response is not ok, return null. Returns undefined for unexpected errors.
 */
export async function displayPosts() {
  try {
    displaySpinner(true);
    displayError(false);

    const url = API_BASE + API_POSTS + API_GET_POSTS_PARAMS;

    const response = await fetch(url, {

      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "GET",
    });

    if (response.ok) {

      /** @type {GetSocialPostsResponse} */
      const postsData = await response.json();
      data = postsData.data;

      updatePosts(data, '');
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

/** @type {HTMLInputElement} */
const txtFilter = document.querySelector("#filter"); // input
txtFilter.addEventListener("input", handleSearchInput);


/**
 * @description Handle the search submit.
 * @method handleSearchInput
 * @param {*} ev 
 */
async function handleSearchInput(ev) {

  const userInput = /** @type {HTMLInputElement} */ ev.currentTarget.value;
  updatePosts(data, userInput);

}

/**
 * @description Map a post to html content
 * @function generateHtml
 * @param {object} item The post properties
 * @returns {Object} Return the object post
 */
function generateHtml(item) {
  const { id, title, author, media, body, created } = item;

  /** @type {HTMLTemplateElement} */
  const template = document.querySelector("#post");

  const post = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

  post.querySelector("h5").innerText = author.name; // + item.id

  /** @type {HTMLImageElement} */
  const authorImg = post.querySelector("#authorImg");
  authorImg.src = author.avatar.url;

  /** @type {HTMLImageElement} */
  const img = post.querySelector("#postImg");
  if (media) {
    img.src = media.url;
    img.alt = media.alt || 'Post image';
  } else {
    img.remove();
    // img.style.display = "none";
  }

  post.querySelector("#bodyTitle").innerHTML = sanitize(title);

  const textLimit = 120;
  const bodyText = post.querySelector("#viewPost");
  let bodyTextSanitized = sanitize(body);

  // post.querySelector("#bodyPost").innerHTML = sanitize(item.body);
  if (bodyTextSanitized.length > textLimit) {
    let htmlBody = bodyTextSanitized.substring(0, textLimit);
    htmlBody += `... <br><a href="./postdetails.html?id=${id}" class="link-offset-2 link-underline link-underline-opacity-0 blue-500 fw-bold">Read More<a/>`;
    bodyText.innerHTML = htmlBody;
  } else {
    bodyText.innerHTML = sanitize(body);
  }

  let date = new Date(created);

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

  return post;
}

/**
 * @description Display posts, filtered by searchInput.
 * @method updatePosts
 * @param {Array<GetSocialPostDataResponse|undefined>} data Posts to be shown.
 * @param {string} searchInput The text to be found. If empty returns all posts.
*/
export async function updatePosts(data, searchInput) {

  /** @type {HTMLDivElement} */
  const posts = document.querySelector("#posts");
  posts.innerHTML = "";

  if (data.length === 0) {
    posts.innerHTML = "No posts found!";
    return;
  }

  data
    .filter(post => {
      const searchText = searchInput.toLowerCase();
      const title = (post.title || '').toLowerCase();
      const body = (post.body || '').toLowerCase();

      if (title.includes(searchText) || body.includes(searchText)) {
        return true;
      }
      return false;
    })
    .map(x => generateHtml(x))
    .forEach(x => {
      posts.appendChild(x);
    });

  return;
}

displayPosts();