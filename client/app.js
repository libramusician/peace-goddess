const PIXI = require('pixi.js');

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application()
app.renderer.autoResize = true
app.renderer.resize(512,512)
let tank;
const gameLoop = (delta) => {
    tank.rotation = 0.5
    tank.x += 1
}
const setup = ()=>{
    tank = new PIXI.Sprite(
        app.loader.resources.tankImage.texture)
    tank.anchor.x = 0.5
    tank.anchor.y = 0.5
    app.stage.addChild(tank)
    app.ticker.add(delta => gameLoop(delta));
}
//load resources
app.loader.add('tankImage','/images/tank.png').load(setup)

// inject into div of html
document.querySelector('#game').appendChild(app.view)
