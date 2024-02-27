// ---------------------------1. settings------------------------

import { API_KEY, API_BASE, API_POSTS } from "../settings.mjs";
import { displayPosts } from "./feedPosts.mjs";
import { load } from "../shared/storage.mjs";

// -------------------------2. types-----------------------------

/** @typedef {object} CreatePostRequest
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media
 * @property {string} media.url
 * @property {string} media.alt
 */


/** @typedef {object} post
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

// -------------3. Function to handle user key -------------------------

// /**
//  * @param {string} key
//  */
// function load(key) {
//   const storedKey = localStorage.getItem(key);
//   const value = storedKey ? JSON.parse(storedKey) : null;
//   return value;
// }

// ---------------4. Function to display error messages------------------
/**
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

// ---------------5. Function to display status messages------------------
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

// -----------------6. Function to display spinner-------------------------

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

// --------------7. function to create a post request | Master child----------

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

    // TODO: add error handler

    // debugger;
    const post = await response.json();

    return post;

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

      // debugger;

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

// ----------------------10. To Do: a class for handle ----------------------------

// const htmlForm = document.querySelector("#createPost");
// cont fp = new FormPost(htmlForm);
// const title = fp.Title;

// class FormPost {
//    let form;
//   constructor(form) {
//     this.form = form;
//   }
//
//   get Title() {
//     return this.form.elements["postTitle"].value;
//   }
// }