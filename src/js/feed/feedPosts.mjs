import { API_KEY, API_BASE, API_POSTS, API_GET_POSTS_PARAMS } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { sanitize } from "../shared/sanitize.mjs";


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

/**
 * @description Function to display error messages
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


export async function displayPosts() {
  try {
    displaySpinner(true);

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
      console.log(data);

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

async function handleSearchInput(ev) {
  const userInput = ev.currentTarget.value;
  updatePosts(data, userInput);
}

/**
 * @description Map a post to html content
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
 * @param {GetSocialPostsResponse["data"]} data
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