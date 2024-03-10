import { API_KEY, API_BASE, API_POSTS } from "../settings.mjs";
import { displayPosts } from "./feedPosts.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { getProfileInfo } from "../shared/profileInfo.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";

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

/**
 * @description Shows or hides a info message.
 * @method statusMsg
 * @param {boolean} visible If true, shows the msg, otherwise hides it.
 * @param {string} [text] The message to show, or `undefined` if `visible` is false.
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
 * @description Create a new user post.
 * @async
 * @function createPost
 * @param {CreatePostRequest} postData The post properties to send to the API
 * @returns {Promise<CreatePostResponse|null|undefined>} If response is ok, return posts. If response is not ok, return null. Returns undefined for unexpected errors.
 */
async function createPost(postData) {
  try {
    displaySpinner(true, "#spinnerCreatePost");
    displayError(false, "#errorCreatePost");

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
    displayError(true, "#errorCreatePost", msg);

    return null;

  } catch (ev) {
    displayError(true, "#errorCreatePost", "Something went wrong, try again!");
  } finally {
    displaySpinner(false, "#spinnerCreatePost");
  }
}

// ---8. Test the function createPost | Automatic output post when you refresh ----

// createPost({
//   title: "Example post",
//   body: "Example post body",
// });

// -------------9. function to display a post request-----------------------------

/** @type {HTMLFormElement} */
const form = document.querySelector("#createPost");
form.addEventListener("submit", handleSubmit);

/**
 * @description Handle the form submit.
 * @method handleSubmit
 * @param {Event} ev
 */
async function handleSubmit(ev) {
  ev.preventDefault();

  displaySpinner(true, "#spinnerCreatePost")
  displayError(false, "#errorCreatePost");

  try {
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

  } catch (ev) {
    displayError(true, "#errorCreatePost", "Could not create a post!");
  } finally {
    displaySpinner(false, "#spinnerCreatePost");
  }
}

let area = document.querySelector("#postText");
area.addEventListener("input", showPostChar);

/**
 * @description Show many characters remaining
 * @method showPostChar
 * @param {Event} ev
 */
function showPostChar(ev) {

  const textArea = /** @type {HTMLTextAreaElement} */ (ev.currentTarget);

  /**@type {HTMLSpanElement}*/
  let characters = document.querySelector("#char");

  let content = textArea.value;
  characters.textContent = `${content.length}/280`;

  content.trim();
  console.log(content);
}

const { avatarUrl, name, bio } = getProfileInfo();

if (name) {
  /** @type {HTMLImageElement} */
  const img = document.querySelector('#author-image');
  img.src = avatarUrl;

  /** @type {HTMLHeadingElement} */
  const authorName = document.querySelector('#author-name');
  authorName.innerText = name;
}
