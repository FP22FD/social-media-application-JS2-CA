// ---------------------------settings------------------------

import { API_KEY, API_BASE, API_POSTS } from "./settings.mjs";

/** @typedef {object} CreatePostRequest
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media
 * @property {string} media.url
 * @property {string} media.alt
 */

// -------------Function to handle user key -------------------------

/**
 * @param {string} key
 */
function load(key) {
  const storedKey = localStorage.getItem(key);
  const value = storedKey ? JSON.parse(storedKey) : null;
  return value;
}
// --------------1. function to create a post-----------------------

/** @param {CreatePostRequest} postData */
async function createPost(postData) {
  const response = await fetch(API_BASE + API_POSTS, {
    headers: {
      Authorization: `Bearer ${load("token")}`,
      "X-Noroff-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(postData),
  });

  console.log(response);

  const post = await response.json();
  //   return post;
  console.log(post);
}

// -------------2. Test if the function createPost works-----------

// createPost({
//   title: "Example post",
//   body: "Example post body",
// });

// -------------3. Function to event post--------------------------

const form = document.querySelector("#createPost");
if (form) {
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    debugger;
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget); // casting, forza il tipo

    const postTitle = form.elements["postTitle"].value;
    const postText = form.elements["postText"].value;
    const postImageUrl = form.elements["postImageUrl"].value;

    const media = postImageUrl
      ? {
          url: postImageUrl,
          alt: "",
        }
      : undefined;

    const request = {
      title: postTitle,
      body: postText,
      tags: [],
      media: media,
    };

    await createPost(request);
  });
}
// ----------------------to do: ----------------------------

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
