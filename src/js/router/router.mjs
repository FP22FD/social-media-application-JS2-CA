import { init as initAuthentication } from "../auth/authentication.mjs";
import { init as initProfile } from "../profile/profile.mjs";
import { init as initDisplayPosts } from "../feed/feedPosts.mjs";
import { init as initCreatePost } from "../feed/createPost.mjs";
import { init as initSearch } from "../feed/search.mjs";
import { init as initSinglePost } from "../feed/singlePost.mjs";
import { init as initLogout } from "../shared/logout.mjs";
// import { checkUserAuth } from "../shared/checkUserAuth.mjs";

function router() {
    const pathname = window.location.pathname;

    switch (pathname) {
        case "/":
        case "/index.html":

            initAuthentication();
            break;

        case "/profile/":
        case "/profile/index.html":
            initProfile();

            initLogout();
            break;

        case "/feed/":
        case "/feed/index.html":
            initDisplayPosts();
            initCreatePost();
            initSearch();

            initLogout();
            break;

        case "/feed/postdetails.html":
            initSinglePost();

            initLogout();
            break;

        default:
            console.error(`Unknown path ${pathname}`);
            break;
    }
}

router();