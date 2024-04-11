export function init() {
    const logoutBtn = document.querySelector("#logout").addEventListener("click", addEventToLogoutBtn);
}

async function addEventToLogoutBtn() {

    localStorage.clear();

    window.location.href = "/";

}