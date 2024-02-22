// ---------------------------1. settings------------------------

import { API_BASE, API_AUTH, API_REGISTER, API_LOGIN } from "./settings.mjs";
import { save, ErrorHandler } from "./shared.mjs";

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

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

// -------------3. Function to handle user key -------------------------

/**
 * @param {string} key
 */
function load(key) {
  const storedKey = localStorage.getItem(key);
  const value = storedKey ? JSON.parse(storedKey) : null;
  return value;
}

/**
 * @param {string} key
 * @param {(string|object)} value
 */
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * @param {string} key
 */
function remove(key) {

  localStorage.removeItem(key);
}

// ---------------4. Class to handle form submission error-----------

class ErrorHandler {
  _response;

  /** @param {Response} response */
  constructor(response) {
    this._response = response;
  }

  async getErrorMessage() {
    if (this._response.ok) {
      return "";
    }

    let errorMessage = "";

    if (this._response.status === 400) {
      /** @type {BadRequestResponse} */
      const data = await this._response.json();
      errorMessage = data.errors[0].message;
    } else if (this._response.status === 401) {
      errorMessage = "Invalid username or password or you do not have an account yet!";
    } else {
      errorMessage = "Unknown error! Please retry later.";
    }

    return errorMessage;
  }
}

// // ---------------4. Function to display error messages------------------
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

// // -----------------5. Function to display spinner-------------------------

/**
 * @param {boolean} spinnerRegister
 * @param {boolean} spinnerLogin
 */
function displaySpinner(spinnerRegister, spinnerLogin) {
  /** @type {HTMLDivElement} */ //To avoid msg error -> "Property "style" does not exist on type "Element".
  const sr = document.querySelector("#spinnerRegister");

  if (spinnerRegister === true) {
    sr.style.display = "block";
  } else {
    sr.style.display = "none";
  }

  /** @type {HTMLDivElement} */
  const sl = document.querySelector("#spinnerLogin");

  if (spinnerLogin === true) {
    sl.style.display = "block";
  } else {
    sl.style.display = "none";
  }
}

// --------------------6. Event----------------------------------

const registerForm = document.querySelector("#register-form");
const loginForm = document.querySelector("#login-form");

displaySpinner(false, false);

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

// // ------------------------7. register------------------------------

// /**
//  * @async
//  * @param {string} name
//  * @param {string} email
//  * @param {string} psw
//  * @return {Promise<RegisterResponse|null>}
//  */
async function register(name, email, psw) {
  try {
    displaySpinner(true, false);

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
    displaySpinner(false, false);
  }
}

// // -----------------------------8. login | Master function-------------------------------
/**
 * @param {string} email
 * @param {string} password
 * @returns {Promise<LoginResponse|null>}
 */
async function login(email, password) {
  try {
    displaySpinner(false, true);

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
    displaySpinner(false, false);
  }
}