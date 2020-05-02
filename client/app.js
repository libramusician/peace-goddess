const PIXI = require('pixi.js');

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application();

document.querySelector('#game').appendChild(app.view)
