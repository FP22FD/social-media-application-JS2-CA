import { load } from "./storage.mjs";

export function getProfileImage() {
    return load("profile").avatar.url;
}
