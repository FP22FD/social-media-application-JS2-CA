import { API_BASE, API_KEY, API_POSTS_PROFILE, API_POST_FOLLOWERS_PROFILE } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { fetchDeletePost } from "./deletePost.mjs";
import { fetchUpdatePost } from "./updatePost.mjs";
import { getProfileInfo } from "../shared/profileInfo.mjs";
import { checkUserAuth } from "../shared/checkUserAuth.mjs";
import { displaySpinner } from "../shared/displaySpinner.mjs";
import { displayError } from "../shared/displayErrorMsg.mjs";

checkUserAuth();

/** @typedef {object} GetProfilePostDataResponse
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

/** @typedef  GetProfilePostMetaResponse
 * @type {object}
 * @property {boolean} isFirstPage
 * @property {boolean} isLastPage
 * @property {number} currentPage
 * @property {null} previousPage
 * @property {null} nextPage
 * @property {number} pageCount
 * @property {number} totalCount
 */

/** @typedef {object} GetProfilePostsResponse
 * @property {Array<GetProfilePostDataResponse>} data
 * @property {GetProfilePostMetaResponse} meta
 */

// -------------------------------------------------

/** @type {Array<GetProfilePostDataResponse>} */
let data = [];

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

// --------------------------------------------------

/** @typedef {object} GetProfileDataResponse
 * @type {object} 
 * @property {string} email
 * @property {string} bio
 * @property {object} avatar
 * @property {string} avatar.url
 * @property {string} avatar.alt
 * @property {object} banner
 * @property {string} banner.url
 * @property {string} banner.alt
 * @property {object} _count
 * @property {number} _count.posts
 * @property {number} _count.followers
 * @property {number} _count.following
 */

/** @typedef  GetProfileMetaResponse
 * @type {object}
 */

/** @typedef {object} GetProfileResponse
 * @property {GetProfileDataResponse} data
 * @property {GetProfileMetaResponse} meta
 */

/** @type {HTMLSelectElement} */
const tabSort = document.querySelector("#order-By")
tabSort.addEventListener("change", handleOrderBy);
/**
 * @description Sort the user array posts by a specified key
 * @method handleOrderBy
 * @param {Event} ev The event from the `select` element.
 * @example 
 * // if the select value is 'title', it return the posts sorted alphabetically a-z.
 * // if the select value is 'newest', it returns the newest posts first.
 * // if the select value is 'oldest', it returns the oldest posts first.
 */
function handleOrderBy(ev) {
    const select = /** @type {HTMLSelectElement} */ (ev.currentTarget);
    const oby = select.value;

    if (oby === "title") {
        data.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1));
    } else if (oby === "newest") {
        data.sort(function (v1, v2) {
            return new Date(v2.created).getTime() - new Date(v1.created).getTime();
        });
    } else if (oby === "oldest") {
        data.sort(function (v1, v2) {
            return new Date(v1.created).getTime() - new Date(v2.created).getTime();
        });
    }
    updatePosts(data);
}

/** 
 * @description Send a request to API
 * @async
 * @function displayPosts
 * @param {string} username  The user name
 * @returns {Promise<GetProfilePostDataResponse[]|null|undefined>} If response is ok, return posts info. If response is not ok, return null. Returns undefined for unexpected errors.
 * 
 * */
export async function displayPosts(username) {
    try {
        displaySpinner(true, "#spinnerPosts");
        displayError(false, "#errorPosts");

        const url = API_BASE + API_POSTS_PROFILE(username);

        const response = await fetch(url, {

            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        if (response.ok) {

            /** @type {GetProfilePostsResponse} */
            const postsData = await response.json();
            data = postsData.data;

            updatePosts(data);
            return data;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();
        displayError(true, "#errorPosts", msg);

        return null;

    } catch (ev) {
        displayError(true, "#errorPosts", "Could not show the posts!");
    } finally {
        displaySpinner(false, "#spinnerPosts");
    }
};

/**
 * @description Map a post to html content
 * @method updatePosts
 * @param {Array<GetProfilePostDataResponse>} data The user posts info.
*/
export async function updatePosts(data) {

    /** @type {HTMLDivElement} */
    const posts = document.querySelector("#posts");
    posts.innerHTML = "";

    if (data.length === 0) {
        posts.innerHTML = "No posts available!";
    } else {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            /** @type {HTMLTemplateElement} */
            const template = document.querySelector("#post");
            const post = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

            post.querySelector("article").dataset.id = String(item.id);

            post.querySelector("h5").innerText = item.author.name;
            /** @type {HTMLImageElement} */
            const authorImg = post.querySelector("#authorImg");
            authorImg.src = item.author.avatar.url;

            /** @type {HTMLImageElement} */
            const img = post.querySelector("#postImg");
            if (item.media) {
                img.src = item.media.url;
                img.alt = item.media.alt || 'Post image';
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

            /** @type {HTMLInputElement} */
            const txtTitle = post.querySelector("#postTitle");
            txtTitle.value = item.title;

            /** @type {HTMLTextAreaElement} */
            const txtBody = post.querySelector("#postText");
            txtBody.value = item.body;

            /** @type {HTMLInputElement} */
            const txtImgUrl = post.querySelector("#postImageUrl");
            txtImgUrl.value = item.media ? item.media.url : '';

            post.querySelector("#form-edit").addEventListener("submit", async (ev) => {
                ev.preventDefault();

                const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

                const postTitle = form.elements["postTitle"].value;
                const postText = form.elements["postText"].value;
                const postImageUrl = form.elements["postImageUrl"].value;

                // NB: I think the API has a bug because it doesn't remove the media object if is not sent.
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

                const post = await fetchUpdatePost(item.id, request);
                if (post) {
                    displayPosts(name);
                    return;
                }
            })

            post.querySelector(`#buttonUpdate`).addEventListener("click", async (ev) => {
                const formEdit = document.querySelector(`article[data-id="${item.id}"] #form-edit`);
                formEdit.classList.remove("d-none");
                formEdit.classList.add("d-flex");

                const buttonSave = document.querySelector(`article[data-id="${item.id}"] #buttonSave`);
                buttonSave.classList.remove("d-none");
                buttonSave.classList.add("d-flex");

                const buttonDelete = document.querySelector(`article[data-id="${item.id}"] #buttonDelete`);
                buttonDelete.classList.remove("d-flex");
                buttonDelete.classList.add("d-none");

                const buttonUpdate = document.querySelector(`article[data-id="${item.id}"] #buttonUpdate`);
                buttonUpdate.classList.remove("d-flex");
                buttonUpdate.classList.add("d-none");

                const buttonClose = document.querySelector(`article[data-id="${item.id}"] #buttonClose`);
                buttonClose.classList.remove("d-none");
                buttonClose.classList.add("d-flex");

                const containerPost = document.querySelector(`article[data-id="${item.id}"] #containerPost`);
                containerPost.classList.remove("d-flex");
                containerPost.classList.add("d-none");

                const reactToPost = document.querySelector(`article[data-id="${item.id}"] #reactToPost`);
                reactToPost.classList.remove("d-flex");
                reactToPost.classList.add("d-none");
            })

            post.querySelector(`#buttonClose`).addEventListener("click", (ev) => {
                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-flex");
                editPost.classList.add("d-none");

                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                confirm.classList.remove("d-flex");
                confirm.classList.add("d-none");

                const error = document.querySelector(`article[data-id="${item.id}"] #errorMsg`);
                error.classList.remove("d-flex");
                error.classList.add("d-none");

                const edit = document.querySelector(`article[data-id="${item.id}"] #edit`);
                edit.classList.remove("d-none");
                edit.classList.add("d-flex");

                const buttonClose = document.querySelector(`article[data-id="${item.id}"] #buttonClose`);
                buttonClose.classList.remove("d-flex");
                buttonClose.classList.add("d-none");

                const formEdit = document.querySelector(`article[data-id="${item.id}"] #form-edit`);
                formEdit.classList.remove("d-flex");
                formEdit.classList.add("d-none");

                const buttonSave = document.querySelector(`article[data-id="${item.id}"] #buttonSave`);
                buttonSave.classList.remove("d-flex");
                buttonSave.classList.add("d-none");

                const buttonDelete = document.querySelector(`article[data-id="${item.id}"] #buttonDelete`);
                buttonDelete.classList.remove("d-none");
                buttonDelete.classList.add("d-flex");

                const buttonUpdate = document.querySelector(`article[data-id="${item.id}"] #buttonUpdate`);
                buttonUpdate.classList.remove("d-none");
                buttonUpdate.classList.add("d-flex");

                updatePosts(data);
            })

            post.querySelector(`#edit`).addEventListener("click", (ev) => {
                const edit = document.querySelector(`article[data-id="${item.id}"] #edit`);
                edit.classList.add("d-none");

                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-none");
                editPost.classList.add("d-flex");
            })

            post.querySelector(`#buttonDelete`).addEventListener("click", (ev) => {
                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                confirm.classList.remove("d-none");
            })

            post.querySelector(`#buttonMsgNo`).addEventListener("click", (ev) => {
                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                confirm.classList.remove("d-flex");
                confirm.classList.add("d-none");

                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-flex");
                editPost.classList.add("d-none");

                updatePosts(data);

            })

            post.querySelector(`#buttonMsgYes`).addEventListener("click", async (ev) => {
                // const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                const result = await fetchDeletePost(item.id);

                if (result) {
                    await displayPosts(name);
                    return;
                }

                const buttonClose = document.querySelector(`article[data-id="${item.id}"] #buttonClose`);
                buttonClose.classList.remove("d-none");
                buttonClose.classList.add("d-flex");
            })

            posts.appendChild(post);
        }
    }
};

/** 
 * @description Send a request to API
 * @async
 * @function fetchUserMetaData
 * @param {string} username  The user name
 * @returns {Promise<GetProfileDataResponse|null|undefined>} 
 * */
export async function fetchUserMetaData(username) {
    try {

        displaySpinner(true, "#spinnerProfileData");
        displayError(false, "#errorProfileData");

        const url = API_BASE + API_POST_FOLLOWERS_PROFILE(username);

        const response = await fetch(url, {

            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        if (response.ok) {

            /** @type {GetProfileResponse} */
            const profileData = await response.json();
            const profileInfo = profileData.data;
            displayUserMetaData(profileInfo);
            return profileInfo;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();
        displayError(true, "#errorProfileData", msg);
        return null;

    } catch (ev) {
        displayError(true, "#errorProfileData", "Could not show the profile data!");
    } finally {
        displaySpinner(false, "#spinnerProfileData");
    }
};

/**
 * @description Displays the number of posts, the number of followers and the number of following.
 * @method displayUserMetaData
 * @param {GetProfileDataResponse} profileInfo user profile info
*/
async function displayUserMetaData(profileInfo) {

    /** @type {GetProfileDataResponse} */
    profileInfo;

    /** @type {HTMLDivElement} */
    const totPosts = document.querySelector("#totPosts");
    totPosts.innerText = String(profileInfo._count.posts);

    /** @type {HTMLDivElement} */
    const totFollowers = document.querySelector("#totFollowers");
    totFollowers.innerText = String(profileInfo._count.followers);

    /** @type {HTMLDivElement} */
    const totFollowing = document.querySelector("#totFollowing");
    totFollowing.innerText = String(profileInfo._count.following);
}

const { avatarUrl, name, bio } = getProfileInfo();

if (name) {
    /** @type {HTMLImageElement} */
    const img = document.querySelector('#author-image');
    img.src = avatarUrl;

    /** @type {HTMLHeadingElement} */
    const authorInfoName = document.querySelector('#author-info h2');
    authorInfoName.innerText = name;

    /** @type {HTMLParagraphElement} */
    const authorInfoBio = document.querySelector('#author-info p');
    authorInfoBio.innerHTML = bio;

    displayPosts(name);
    fetchUserMetaData(name);
}
