// ---------------------------1. settings------------------------

import { API_KEY } from "../settings.mjs";
import { load } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
// import { sanitize } from "../shared/sanitize.mjs";
import { fetchDeletePost } from "./deletePost.mjs";

// -------------------------2. types-----------------------------

/** @typedef {object} GetProfilePostsResponse
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

/** @type {GetProfilePostsResponse["data"]} */
let data = [];

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

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

// -----------------4. Function to display spinner-------------------------

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

        const url = "https://v2.api.noroff.dev/social/profiles/Fernanda/posts/?_author=true&_comments=true&_reactions=true";

        const response = await fetch(url, {

            headers: {
                Authorization: `Bearer ${load("token")}`,
                "X-Noroff-API-Key": API_KEY,
                "Content-Type": "application/json",
            },
            method: "GET",
        });

        // debugger;

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


// -------------6. Function to sanitize inputs innerHTML --------------

/** @param {string} html */
function sanitize(html) {
    // @ts-ignore
    return DOMPurify.sanitize(html);
}


// -------------6. Function to update posts -------------------------

/**
 * @param {GetProfilePostsResponse["data"]} data
*/
export async function updatePosts(data) {

    /** @type {HTMLDivElement} */
    const posts = document.querySelector("#posts");
    posts.innerHTML = "";

    // debugger;

    if (data.length === 0) {
        posts.innerHTML = "No posts available!";
        // debugger;
    } else {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];

            /** @type {HTMLTemplateElement} */
            const template = document.querySelector("#post");
            const post = /** @type {HTMLDivElement} */ (template.content.cloneNode(true));

            post.querySelector("article").dataset.id = String(item.id);

            post.querySelector("h5").innerText = item.author.name + item.id;
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

            // post.querySelector("#tags").innerHTML = sanitize(item.tags);

            // post.querySelector("#bodyTitle").innerHTML = sanitize(item.title);
            post.querySelector("#bodyTitle").innerHTML = item.title;

            post.querySelector("#bodyPost").innerHTML = item.body;

            // post.querySelector("#bodyPost").innerHTML = sanitize(item.body);
            // let bodyTextSanitized = sanitize(item.body);
            // const bodyText = post.querySelector("#viewPost");

            // const textLimit = 120;

            // if (bodyTextSanitized.length > textLimit) {
            //     let htmlBody = bodyTextSanitized.substring(0, textLimit);
            //     htmlBody += `... <br><a href="./postdetails.html?id=${item.id}" class="link-offset-2 link-underline link-underline-opacity-0">Read More<a/>`;
            //     bodyText.innerHTML = htmlBody;
            // } else {
            //     bodyText.innerHTML = sanitize(item.body);
            // }


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





            // ------------------------------------------------------

            // post.querySelector("#edit").addEventListener("click", (ev) => {
            //     console.log("event");

            //     const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
            //     editPost.classList.remove("d-none");
            //     editPost.classList.add("d-flex");

            //     // document.querySelector(`article[data-id="${item.id}"] #buttonUpdate`).addEventListener("click", (ev) => {
            //     //     console.log("update")
            //     // })

            //     // document.querySelector(`article[data-id="${item.id}"] #buttonDelete`).addEventListener("click", (ev) => {
            //     //     console.log("delete")
            //     // })
            // });

            // ------------------------------------------------------

            post.querySelector("#postTitle").value = item.title;
            post.querySelector("#postText").value = item.body;
            // post.querySelector("#postImageUrl").value = item.media.url;

            // to do: if media is underfied ...

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
            })

            post.querySelector(`#edit`).addEventListener("click", (ev) => {
                console.log("edit");

                const edit = document.querySelector(`article[data-id="${item.id}"] #edit`);
                edit.classList.add("d-none");

                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-none");
                editPost.classList.add("d-flex");
            })

            post.querySelector(`#buttonUpdate`).addEventListener("click", (ev) => {
                console.log("update");

                const buttonUpdate = post.querySelector("#buttonUpdate");
                console.log(buttonUpdate + " " + "This variable works");
            })

            post.querySelector(`#buttonDelete`).addEventListener("click", (ev) => {
                console.log("delete");

                // const buttonDelete = post.querySelector("#buttonDelete");
                // const buttonDelete = post.querySelector(`article[data-id="${item.id}"] #buttonDelete`);
                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                confirm.classList.remove("d-none");

            })

            post.querySelector(`#buttonMsgNo`).addEventListener("click", (ev) => {
                console.log("No. I'm not sure!");
                // const buttonUpdate = post.querySelector(`article[data-id="${item.id}"] #buttonMsgNo`);

                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                console.log(confirm + " " + "This confirm button (No) works");
                confirm.classList.remove("d-flex");
                confirm.classList.add("d-none");

                const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                editPost.classList.remove("d-flex");
                editPost.classList.add("d-none");



                // const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                // editPost.classList.remove("d-none");
                // // editPost.classList.add("d-flex");

                updatePosts(data);

            })

            post.querySelector(`#buttonMsgYes`).addEventListener("click", async (ev) => {
                console.log("Yes, sure!");
                // const buttonMsgYes = post.querySelector(`article[data-id="${item.id}"] #buttonMsgYes`);

                const confirm = document.querySelector(`article[data-id="${item.id}"] #confirmAction`);
                console.log(confirm + " " + "This confirm button (Yes) works");

                // call API to delete post by id
                const result = await fetchDeletePost(item.id);

                if (result) {
                    await displayPosts();
                    return;
                }

                const buttonClose = document.querySelector(`article[data-id="${item.id}"] #buttonClose`);
                console.log(buttonClose + " " + "This confirm button (No) works");
                buttonClose.classList.remove("d-none");
                buttonClose.classList.add("d-flex");

                // confirm.classList.remove("d-flex");
                // confirm.classList.add("d-none");

                // const editPost = document.querySelector(`article[data-id="${item.id}"] #edit-post`);
                // editPost.classList.remove("d-flex");
                // editPost.classList.add("d-none");

                // updatePosts(data);

            })

            post.querySelector(`#buttonSave`).addEventListener("click", (ev) => {
                console.log("save");
                const buttonSave = post.querySelector("#buttonSave");
            })

            posts.appendChild(post);
        }
    }

};

/**
 * 
 * @param {number} id 
 */
function resetEdit(id) {

    // document.getElementById("#posts").ariaValueMax.reset();
}

displayPosts();