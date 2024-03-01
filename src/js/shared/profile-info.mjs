import { load } from "./storage.mjs";

/** @typedef {object} ProfileInfo
 * @property {string} name
 * @property {string} bio
 * @property {string} avatarUrl
 */

/**
 * It returns the profile information.
 * @returns {ProfileInfo}
 */
export function getProfileInfo() {
    const profile = load("profile");
    const name = profile.name;
    const bio = profile.bio;
    const avatarUrl = profile.avatar.url;

    const result = {
        name,
        bio,
        avatarUrl
    };

    return result;
}