// /** @typedef {object} BadRequestResponse
//  * @property {object[]} errors
//  * @property {string} errors.message
//  * @property {string} status
//  * @property {number} statusCode
//  */

// -------------3. Function to handle user key -------------------------//

// /**
//  * @param {string} key
//  */
// export function load(key) {
//     const storedKey = localStorage.getItem(key);
//     const value = storedKey ? JSON.parse(storedKey) : null;
//     return value;
// }

// /**
//  * @param {string} key
//  * @param {(string|object)} value
//  */
// export function save(key, value) {
//     localStorage.setItem(key, JSON.stringify(value));
// }

// /**
//  * @param {string} key
//  */
// export function remove(key) {

//     localStorage.removeItem(key);
// }


// ---------------4. Class to handle form submission error-----------

// export class ErrorHandler {
//     _response;

//     /** @param {Response} response */
//     constructor(response) {
//         this._response = response;
//     }

//     async getErrorMessage() {
//         if (this._response.ok) {
//             return "";
//         }

//         let errorMessage = "";

//         if (this._response.status === 400) {
//             /** @type {BadRequestResponse} */
//             const data = await this._response.json();
//             errorMessage = data.errors[0].message;
//         } else if (this._response.status === 401) {
//             errorMessage = "Invalid username or password or you do not have an account yet!";
//         } else {
//             errorMessage = "Unknown error! Please retry later.";
//         }

//         return errorMessage;
//     }
// }


// -------------6. Function to sanitize inputs innerHTML --------------

// /** @param {string} html */
// export function sanitize(html) {
//     // @ts-ignore
//     return DOMPurify.sanitize(html);
// }