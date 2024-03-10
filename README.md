# css-frameworks-ca | PostaMe

`PostaME` is a responsive web application which goal is to keep connected with others people.

![figma](https://github.com/FP22FD/css-frameworks-ca/assets/112474910/f04e6456-9af3-435d-a9a4-f6fbad42f1e8)

- [Brief](docs/css-frameworks-brief.pdf)
- [Criteria](docs/css-frameworks-criteria.pdf)

## Live app

This project is deployed on [Netlify](https://js2--postame.netlify.app/).

## Local development

> npm install
> npm run dev

## CA goals

The goal of this Course Assignment was to learn:

- REST API advanced features like POST, PUT, DELETE
- documentation via `JsDocs`
- array functions: `filter`, `map`, `forEach`
- destructuring
- `JWT` token and API authorization concepts
- usage of `local storage`

## API

- The API used in this project can be found under Social Endpoints in the Noroff API documentation. [v2](https://docs.noroff.dev/docs/v2).
- Social API routes require both a JWT token and an API Key.

## Feature implemented

- user can register (only @noroff.no or @stud.noroff.no email can register a new profile)
- user can login
- a logged-in user can:
  - view the user content feed
  - filter the content feed
  - search the content feed
  - view a post content by ID
  - create a new post
  - update a post
  - delete a post

## Optional features that have not been implemented

- a logged-in user can:
  - create a comment on a post
  - edit his profile
  - follow/unfollow a profile
  - react to a post

## Development task management

- [GitHub Projects](https://github.com/users/FP22FD/projects/3).

<!-- - Describe any prerequisites, libraries, OS version, etc., needed before installing the program.
- ex. Windows 10 -->

## JSDOC

The code is documented using `JsDocs`.

The javascript code is typed-checked using JsDoc via [jsconfig](https://code.visualstudio.com/docs/languages/jsconfig).

To include the DOM and modern `types`, DOM (for example `document`, `fetch`) and ES2015 (for example `Promise<T>`) has been included.

`node_modules` and `assets` has been excluded.

The documentation can be generated in `/out/index` using:

> npm run docs

## Validation

The web application code has been validated using the following tools:

- check html validity: <https://validator.w3.org/>

- check css validity: <https://jigsaw.w3.org/css-validator/>

- check redirect links: <https://validator.w3.org/checklink>

- check accessibility: <https://www.accessibilitychecker.org/>

NB: some empty CSS classes are flagged as errors by the [W3 validator](http://validator.w3.org).
The issue is probably caused by [a bug](https://github.com/twbs/bootstrap/issues/36508) in the web tool.

## Dependencies

To develop the web application I have used `Visual Studio Code` with `Prettier` formatter extension.
