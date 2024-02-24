/** @param {string} html
 * @returns {string}
 */
export function sanitize(html) {
    // @ts-ignore
    return DOMPurify.sanitize(html);
}