import { API_BASE, API_AUTH, API_REGISTER } from "../settings.mjs";
import { ErrorHandler } from "../shared/errorHandler.mjs";
import { displayError } from "./authentication.mjs";

// -------------------------2. types-----------------------------

// generated via https://transform.tools/json-to-jsdoc

/** @typedef {object} RegisterResponse
 * @property {object} data
 * @property {string} data.name
 * @property {string} data.email
 * @property {string} data.bio
 * @property {object} data.avatar
 * @property {string} data.avatar.url
 * @property {string} data.avatar.alt
 * @property {object} data.banner
 * @property {string} data.banner.url
 * @property {string} data.banner.alt
 */

// -----------------5. Function to display spinner-------------------------

/**
 * @param {boolean} spinnerRegister
 */
function displaySpinnerRegister(spinnerRegister) {
    /** @type {HTMLDivElement} */ //To avoid msg error -> "Property "style" does not exist on type "Element".
    const sr = document.querySelector("#spinnerRegister");

    if (spinnerRegister === true) {
        sr.style.display = "block";
    } else {
        sr.style.display = "none";
    }
}

displaySpinnerRegister(false);

// ------------------------7. register------------------------------

/**
 * @async
 * @param {string} name
 * @param {string} email
 * @param {string} psw
 * @return {Promise<RegisterResponse|null>}
 */
export async function register(name, email, psw) {
    try {
        displaySpinnerRegister(true);

        const url = API_BASE + API_AUTH + API_REGISTER;
        const request = {
            name: name,
            email: email,
            password: psw,
        };

        const response = await fetch(url, {

            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request),
        });

        if (response.ok) {
            /** @type {RegisterResponse} */
            const data = await response.json();
            return data;
        }

        const eh = new ErrorHandler(response);
        const msg = await eh.getErrorMessage();
        displayError(true, msg);

        return null;

    } catch (ev) {
        displayError(true, "Could not register the account!");
    } finally {
        displaySpinnerRegister(false);
    }
}