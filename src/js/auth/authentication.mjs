import { login } from "./login.mjs";
import { register } from "./register.mjs";

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


// ---------------4. Function to display error messages------------------
/**
 * @param {boolean} visible
 * @param {string} text
 */
export function displayError(visible, text) {
    /** @type {HTMLDivElement} */
    const error = document.querySelector("#error");

    if (visible === true) {
        error.style.display = "block";
        error.innerHTML = text;
    } else {
        error.style.display = "none";
    }
}