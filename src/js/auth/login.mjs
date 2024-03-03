import { API_BASE, API_AUTH, API_LOGIN } from "../settings.mjs";
import { displayError } from "./authentication.mjs";
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


/**
 * @param {boolean} spinnerLogin
 */
function displaySpinnerLogin(spinnerLogin) {
    /** @type {HTMLDivElement} */ //To set the element type -> "Property "style" does not exist on type "Element".
    const sl = document.querySelector("#spinnerLogin");

    if (spinnerLogin === true) {
        sl.style.display = "block";
    } else {
        sl.style.display = "none";
    }
}

displaySpinnerLogin(false);

/** 
 * @param {string} email
 * @param {string} password
 * @returns {Promise<LoginResponse|null>}
 */
export async function login(email, password) {
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