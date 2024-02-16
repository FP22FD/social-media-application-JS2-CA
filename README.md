# css-frameworks-ca | CrochetME

`CrochetME` is a responsive web application which goal is to keep in contact lovers of handmade crochet.

![figma](https://github.com/FP22FD/css-frameworks-ca/assets/112474910/f04e6456-9af3-435d-a9a4-f6fbad42f1e8)

- [Brief](docs/css-frameworks-brief.pdf)
- [Criteria](docs/css-frameworks-criteria.pdf)

## Live app

This project is deployed on [Netlify](https://luminous-pothos-3e9a98.netlify.app/).

## CA goals

The goal of this Course Assignment was to learn:

- `NodeJs` and `npm` environment
- `Bootstrap` features like grids, components, utility, etc avoiding custom `css` and `javascript`
- `sass` used to customize `Bootstrap`

### Authentication page (/index.html)

The `authentication page` should have a form to login or register to the application. Ensure to include HTML form validation and use /profile as the action attribute. Password must have a minimum length of 8 characters.

### Feed Page (/feed/index.html)

The `feed page` should have a list of posts thumbnails, a search bar, sort options and a form to create a new post. You may add additional design features beyond these requirements.

### Profile page (/profile/index.html)

The `profile page` should have a profile image, username, list of user posts, follow button and an area to display following/followers.

## How to run locally

- Ensure you have [Node.js](https://nodejs.org/) > 20.x installed.
- Clone/Fork the repository: <https://github.com/FP22FD/css-frameworks-ca>
- Navigate to the project directory
- Install npm dependencies
  > `npm install`
- Run in `watch` mode
  > `npm run dev`

## Customization

The `Bootstrap` customization is restricted to the `$primary` color and other few variables.

<!-- - Describe any prerequisites, libraries, OS version, etc., needed before installing the program.
- ex. Windows 10 -->

## JSDOC

The javascript code is typed check using JsDoc via [jsconfig](https://code.visualstudio.com/docs/languages/jsconfig).

To include the DOM and modern `types`, DOM (for example `document`, `fetch`) and ES2015 (for example `Promise<T>`) has been included.

`node_modules` and `assets` has been excluded.

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
