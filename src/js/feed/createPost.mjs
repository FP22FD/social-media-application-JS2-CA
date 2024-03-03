import { API_KEY, API_BASE, API_POSTS } from "../settings.mjs";
import { displayPosts, updatePosts } from "./feedPosts.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { getProfileInfo } from "../shared/profile-info.mjs";

// /** @typedef SocialPostDataResponse
//  * @type {object} 
//  * @property {number} id
//  * @property {string} title
//  * @property {string} body
//  * @property {string[]} tags
//  * @property {object} media // null
//  * @property {string} media.url
//  * @property {string} media.alt
//  * @property {string} created
//  * @property {string} updated
//  * @property {object} author
//  * @property {string} author.name
//  * @property {string} author.email
//  * @property {null|string} author.bio
//  * @property {object} author.avatar
//  * @property {string} author.avatar.url
//  * @property {string} author.avatar.alt
//  * @property {object} author.banner
//  * @property {string} author.banner.url
//  * @property {string} author.banner.alt
//  * @property {object} _count
//  * @property {number} _count.comments
//  * @property {number} _count.reactions
//  */

// /** @typedef  SocialPostMetaResponse
//  * @type {object} 
//  * @property {boolean} isFirstPage
//  * @property {boolean} isLastPage
//  * @property {number} currentPage
//  * @property {null} previousPage
//  * @property {null} nextPage
//  * @property {number} pageCount
//  * @property {number} totalCount
//  */

// /** @typedef {object} GetSocialPostsResponse
//  * @property {Array<SocialPostDataResponse>} data
//  * @property {SocialPostMetaResponse} meta
//  */

// /** @type {Array<SocialPostDataResponse>} */
// // let data = [];

/** @typedef {object} CreatePostRequest
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media
 * @property {string} media.url
 * @property {string} media.alt
 */


/** @typedef {object} CreatePostResponse
 * @property {object} data
 * @property {number} data.id
 * @property {string} data.title
 * @property {string} data.body  
 * @property {string} data.tags
 * @property {null} data.media
 * @property {string} data.created
 * @property {string} data.updated
 * @property {object} data._count
 * @property {number} data._count.comments
 * @property {number} data._count.reactions
 */

/** @type {HTMLImageElement} */
const img = document.querySelector('#author-image');
img.src = getProfileInfo().avatarUrl

/** @type {HTMLHeadingElement} */
const authorName = document.querySelector('#author-name');
authorName.innerText = getProfileInfo().name

/**
 * @description display a message error
 * @param {boolean} visible
 * @param {string|null} text
 */
function displayError(visible, text) {
  /** @type {HTMLDivElement} */
  const error = document.querySelector("#errorCreatePost");

  if (visible === true) {
    error.style.display = "block";
    error.innerHTML = text;
  } else {
    error.style.display = "none";
  }
}

/**
 * @param {boolean} visible
 * @param {string} text
 */
function statusMsg(visible, text) {
  /** @type {HTMLDivElement} */
  const status = document.querySelector("#statusMsg");

  if (visible === true) {
    status.style.display = "block";
    status.innerHTML = text;
  } else {
    status.style.display = "none";
  }
}


/**
 * @param {boolean} spinnerVisible
 */
function displaySpinner(spinnerVisible) {
  /** @type {HTMLDivElement} */
  const spinner = document.querySelector("#spinnerCreatePost");

  if (spinnerVisible === true) {
    spinner.style.display = "block";
  } else {
    spinner.style.display = "none";
  }
}

displaySpinner(false);


/** @param {CreatePostRequest} postData */
async function createPost(postData) {
  try {
    displaySpinner(true);

    const url = API_BASE + API_POSTS;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(postData),
    });

    if (response.ok) {

      /** @type {CreatePostResponse} */
      const post = await response.json();

      // updatePosts(data);
      return post;
    }

    const eh = new ErrorHandler(response);
    const msg = await eh.getErrorMessage();
    displayError(true, msg);

    return null;

  } catch (ev) {
    displayError(true, "Something went wrong, try again!");
  } finally {
    displaySpinner(false);
  }
}

// ---8. Test the function createPost | Automatic output post when you refresh ----

// createPost({
//   title: "Example post",
//   body: "Example post body",
// });

// -------------9. function to display a post request-----------------------------

const form = document.querySelector("#createPost");


if (form) {
  try {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();

      const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

      const postTitle = form.elements["postTitle"].value;
      const postText = form.elements["postText"].value;
      const postImageUrl = form.elements["postImageUrl"].value;

      const media = postImageUrl ? {
        url: postImageUrl,
        alt: "",
      } : undefined;

      const request = {
        title: postTitle,
        body: postText,
        tags: [],
        media: media,
      };

      const post = await createPost(request);
      if (post) {
        statusMsg(true, "Well done! You have created a new post.");

        setTimeout(() => { //https://developer.mozilla.org/en-US/docs/Web/API/setTimeout
          statusMsg(false, "");
        }, 4000);

        form.reset();
        displayPosts();
      }
    });

  } catch (ev) {
    displayError(true, "Could not create a post!");
  } finally {
    displaySpinner(false);
  }
}