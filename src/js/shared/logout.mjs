export function init() {

    // addEventToLogoutBtn();

    const logoutBtn = document.querySelector("#logout").addEventListener("click", addEventToLogoutBtn);
}

async function addEventToLogoutBtn(ev) {

    // remove("profile");
    // remove("token");

    localStorage.clear();

    window.location.href = "/";

}

// function addEventToLogoutBtn() {
//     const logoutBtn = document.querySelector("#logout");
//     logoutBtn.addEventListener("click", async (ev) => {

//         // remove("profile");
//         // remove("token");

//         localStorage.clear();

//         window.location.href = "/";

//     })
// }

// addEventToLogoutBtn();

// document.querySelector('#logout').addEventListener('click', () => {
//     // remove("profile");
//     // remove("token");

//     localStorage.clear();

//     window.location.href = "/";
// });