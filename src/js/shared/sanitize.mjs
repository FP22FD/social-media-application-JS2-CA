/** @param {string} html */
export function sanitize(html) {
    // @ts-ignore
    return DOMPurify.sanitize(html);
}