import { API_BASE, API_KEY, API_POSTS_PROFILE } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { sanitize } from "../shared/sanitize.mjs";
import { fetchDeletePost } from "./deletePost.mjs";
import { fetchUpdatePost } from "./updatePost.mjs";
import { getProfileInfo } from "../shared/profile-info.mjs";


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

/** @type {Array<GetProfilePostDataResponse>} */
let data = [];

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

/** @type {HTMLImageElement} */
const img = document.querySelector('#author-image');
img.src = getProfileInfo().avatarUrl;

/** @type {HTMLHeadingElement} */
const authorInfoName = document.querySelector('#author-info h2');
authorInfoName.innerText = getProfileInfo().name;

/** @type {HTMLParagraphElement} */
const authorInfoBio = document.querySelector('#author-info p');
authorInfoBio.innerHTML = getProfileInfo().bio;

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


/** @type {HTMLSelectElement} */
const tabSort = document.querySelector("#order-By")
tabSort.addEventListener("change", handleOrderBy);

/**
 * @param {Event} ev
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


/** @param {string} username  */
export async function displayPosts(username) {
    try {
        displaySpinner(true);

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
            console.log(data);

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
};


/**
 * @param {Array<GetProfilePostDataResponse>} data
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

            // debugger;

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
                console.log("Form edit");
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

                const post = await fetchUpdatePost(item.id, request);
                if (post) {
                    displayPosts(profile.name);
                    return;
                }
            })

            post.querySelector(`#buttonUpdate`).addEventListener("click", async (ev) => {
                console.log("update");

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
                console.log("close");

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
                console.log("edit");

                const edit = document.querySelector(`article[data-id="${item.id}"] #edit`);
                edit.classList.add("d-none");

                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-none");
                editPost.classList.add("d-flex");
            })

            post.querySelector(`#buttonDelete`).addEventListener("click", (ev) => {
                console.log("delete");

                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                confirm.classList.remove("d-none");
            })

            post.querySelector(`#buttonMsgNo`).addEventListener("click", (ev) => {
                console.log("No. I'm not sure!");

                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                console.log(confirm + " " + "This confirm button (No) works");
                confirm.classList.remove("d-flex");
                confirm.classList.add("d-none");

                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-flex");
                editPost.classList.add("d-none");

                updatePosts(data);

            })

            post.querySelector(`#buttonMsgYes`).addEventListener("click", async (ev) => {
                console.log("Yes, sure!");

                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                console.log(confirm + " " + "This confirm button (Yes) works");

                const result = await fetchDeletePost(item.id);

                if (result) {
                    await displayPosts(profile.name);
                    return;
                }

                const buttonClose = document.querySelector(`article[data-id="${item.id}"] #buttonClose`);
                console.log(buttonClose + " " + "This confirm button (No) works");
                buttonClose.classList.remove("d-none");
                buttonClose.classList.add("d-flex");
            })

            posts.appendChild(post);
        }
    }
};


const profile = load('profile');
if (profile.name) {
    displayPosts(profile.name);
}