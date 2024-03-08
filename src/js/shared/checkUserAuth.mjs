import { load } from "./storage.mjs";

/**
 * @description
 */
export function checkUserAuth() {
    // debugger;
    // const checkAccessToken = localStorage.getItem("key");
    const checkAccessToken = load("token");

    if (!checkAccessToken) {
        window.location.href = ("/");
    }
}