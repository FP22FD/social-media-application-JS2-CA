import { API_BASE, API_AUTH, API_LOGIN } from "../settings.mjs";
import { displayError } from "./authentication.mjs";
import { register } from "./register.mjs";
import { save } from "../shared/storage.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";


/** @typedef {object} LoginResponse
 * @property {object} data
 * @property {string} data.name
 * @property {string} data.email
 * @property {null} data.bio
 * @property {object} data.avatar
 * @property {string} data.avatar.url
 * @property {string} data.avatar.alt
 * @property {object} data.banner
 * @property {string} data.banner.url
 * @property {string} data.banner.alt
 * @property {string} data.accessToken
 */

// -----------------5. Function to display spinner-------------------------

/**
 * @param {boolean} spinnerLogin
 */
function displaySpinnerLogin(spinnerLogin) {
    /** @type {HTMLDivElement} */ //To avoid msg error -> "Property "style" does not exist on type "Element".
    const sl = document.querySelector("#spinnerLogin");

    if (spinnerLogin === true) {
        sl.style.display = "block";
    } else {
        sl.style.display = "none";
    }
}

displaySpinnerLogin(false);

// -----------------------------8. login | Master function-------------------------------
/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<LoginResponse|null>}
 */
async function login(email, password) {
    try {
        displaySpinnerLogin(true);

        const url = API_BASE + API_AUTH + API_LOGIN;
        const request = {
            email: email,
            password: password,
        };

        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(request),
        });

        if (response.ok) {
            /** @type {LoginResponse} */
            const userInfo = await response.json();

            const { accessToken, ...profile } = userInfo.data;
            save("token", accessToken);
            save("profile", profile);
            return userInfo;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();

        displayError(true, msg);
        return null;

    } catch (ev) {
        displayError(true, "Could not login! Please retry later.");
    } finally {
        displaySpinnerLogin(false);
    }
}

// ------------------------------------------ To Do:---------------------------------------------------
// --------------------------non ci riesco a fare lo export da pagina autothentication---------------

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");

registerForm?.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

    const name = form.elements["username"].value;
    const email = form.elements["emailAddress"].value;
    const password = form.elements["password"].value;
    const confirmPassword = form.elements["confirmPassword"].value;

    if (password !== confirmPassword) {
        displayError(true, "The passwords have to match!");
        return;
    }
    const response = await register(name, email, password);
    if (!response) {
        return;
    }

    const profile = await login(email, password);
    if (profile === null) {
        return;
    }

    window.location.href = "/profile/index.html";
});

loginForm?.addEventListener("submit", async (ev) => {
    ev.preventDefault();

    // This is called Casting or Type Casting ("force way to ignore type errors"): https://dev.to/samuel-braun/boost-your-javascript-with-jsdoc-typing-3hb3
    const form = /** @type {HTMLFormElement} */ (ev.currentTarget);

    const email = form.elements["loginEmail"].value;
    const password = form.elements["loginPassword"].value;

    const profile = await login(email, password);
    // debugger;
    if (profile === null) {
        return;
    }
    window.location.href = "/profile/index.html";
});