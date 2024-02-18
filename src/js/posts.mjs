// ---------------------------settings------------------------

import { API_KEY, API_BASE, API_POSTS, API_PARAMS } from "./settings.mjs"; // import settings

// -------------------------types-----------------------------

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

/**
 * @param {string} key
 */
function load(key) {
  const storedKey = localStorage.getItem(key);
  const value = storedKey ? JSON.parse(storedKey) : null;
  return value;
}

// ---------------Function to display error messages------------------
/**
 * @param {boolean} visible
 * @param {string} text
 */
function displayError(visible, text) {
  /** @type {HTMLDivElement} */
  const error = document.querySelector("#error");

  if (visible === true) {
    error.style.display = "block";
    error.innerHTML = text;
  } else {
    error.style.display = "none";
  }
}
// -------------Function to display posts -------------------------

async function displayPosts() {
  try {
    const response = await fetch(API_BASE + API_POSTS + API_PARAMS, {
      headers: {
        Authorization: `Bearer ${load("token")}`,
        "X-Noroff-API-Key": API_KEY,
        "Content-Type": "application/json", //https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type
      },
    });

    /** @type {GetSocialPostsResponse} */
    const postsData = await response.json();

    data = postsData.data;
    console.log(data);
  } catch (e) {
    displayError(true, "Could not show the posts!");
  } finally {
    // displaySpinner(false);
  }

  updatePosts(data);
}

// -------------Function to update posts -------------------------

/**
 * @param {GetSocialPostsResponse["data"]} data
 */
async function updatePosts(data) {
  /** @type {HTMLDivElement} */
  const posts = document.querySelector("#posts");
  posts.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    /** @type {HTMLTemplateElement} */
    const template = document.querySelector("#post");

    const post = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

    post.querySelector("h5").innerText = item.author.name;

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
    post.querySelector("#bodyPost").innerHTML = item.body;

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

displayPosts().then(console.log);

// ------------------------------------------------------------

// document.querySelector("#orderBy").addEventListener("change", handleOrderBy);

// function handleOrderBy(event) {
//   const oby = event.target.value;

//   if (oby === "name") {
//     data.sort((a, b) => (a.id.toLowerCase() > b.id.toLowerCase() ? 1 : -1));
//   }
//   updatePosts(data);
// }
