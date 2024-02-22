// -------------------------2. types | Authentication-----------------------------

// generated via https://transform.tools/json-to-jsdoc

/** @typedef {object} RegisterResponse
 * @property {object} data
 * @property {string} data.name
 * @property {string} data.email
 * @property {string} data.bio
 * @property {object} data.avatar
 * @property {string} data.avatar.url
 * @property {string} data.avatar.alt
 * @property {object} data.banner
 * @property {string} data.banner.url
 * @property {string} data.banner.alt
 */

/** @typedef {object} LoginResponse
 * @property {object} data
 * @property {string} data.name
 * @property {string} data.email
 * @property {null} data.bio
 * @property {object} data.avatar
 * @property {string} data.avatar.url
 * @property {string} data.avatar.alt
 * @property {object} data.banner
 * @property {string} data.banner.url
 * @property {string} data.banner.alt
 * @property {string} data.accessToken
 */

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 * 
// -------------------------2. types | FeedPosts-----------------------------

/** @typedef {object} GetSocialPostsResponse
 * @property {object[]} data
 * @property {number} data.id
 * @property {string} data.title
 * @property {string} data.body
 * @property {string[]} data.tags
 * @property {object} data.media // null
 * @property {string} data.media.url
 * @property {string} data.media.alt
 * @property {string} data.created
 * @property {string} data.updated
 * @property {object} data.author
 * @property {string} data.author.name
 * @property {string} data.author.email
 * @property {null|string} data.author.bio
 * @property {object} data.author.avatar
 * @property {string} data.author.avatar.url
 * @property {string} data.author.avatar.alt
 * @property {object} data.author.banner
 * @property {string} data.author.banner.url
 * @property {string} data.author.banner.alt
 * @property {object} data._count
 * @property {number} data._count.comments
 * @property {number} data._count.reactions
 * @property {object} meta
 * @property {boolean} meta.isFirstPage
 * @property {boolean} meta.isLastPage
 * @property {number} meta.currentPage
 * @property {null} meta.previousPage
 * @property {null} meta.nextPage
 * @property {number} meta.pageCount
 * @property {number} meta.totalCount
 */

/** @type {GetSocialPostsResponse["data"]} */
let data = [];

/** @typedef {object} BadRequestResponse
 * @property {object[]} errors
 * @property {string} errors.message
 * @property {string} status
 * @property {number} statusCode
 */

// -------------------------2. types | CreatePost-----------------------------

/** @typedef {object} CreatePostRequest
 * @property {string} title
 * @property {string} body
 * @property {string[]} tags
 * @property {object} media
 * @property {string} media.url
 * @property {string} media.alt
 */


/** @typedef {object} post
 * @property {object} data
 * @property {number} data.id
 * @property {string} data.title
 * @property {string} data.body  
 * @property {string} data.tags
 * @property {null} data.media
 * @property {string} data.created
 * @property {string} data.updated
 * @property {object} data._count
 * @property {number} data._count.comments
 * @property {number} data._count.reactions
 */