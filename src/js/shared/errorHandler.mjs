/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

export class ErrorHandler {
    _response;

    /** @param {Response} response */
    constructor(response) {
        this._response = response;
    }

    async getErrorMessage() {
        if (this._response.ok) {
            return "";
        }

        let errorMessage = "";

        if (this._response.status === 400) {
            /** @type {BadRequestResponse} */
            const data = await this._response.json();
            errorMessage = data.errors[0].message;
        } else if (this._response.status === 401) {
            errorMessage = "Invalid username or password or you do not have an account yet!";
        } else {
            errorMessage = "Unknown error! Please retry later.";
        }

        return errorMessage;
    }
}