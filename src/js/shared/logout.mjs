import { remove } from "./storage.mjs"

document.querySelector('#logout').addEventListener('click', () => {
    remove("profile");
    remove("token");

    window.location.href = "/";
});
