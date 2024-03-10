document.querySelector('#logout').addEventListener('click', () => {
    // remove("profile");
    // remove("token");

    localStorage.clear();

    window.location.href = "/";
});
