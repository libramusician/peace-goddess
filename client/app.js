const PIXI = require('pixi.js');
const keyboard = require('./key').keyboard;
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application()
app.renderer.autoResize = true
app.renderer.resize(512,512)
let tank;


//load resources
app.loader.add('tankImage','/images/tank.png').load(setup)

// inject into div of html
document.querySelector('#game').appendChild(app.view)

let state
function setup() {

  //Create the `cat` sprite 
  tank = new PIXI.Sprite(app.loader.resources["tankImage"].texture);
  tank.y = 96; 
  tank.vx = 0;
  tank.vy = 0;
  app.stage.addChild(tank);

  //Capture the keyboard arrow keys
  let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown");

  //Left arrow key `press` method
  left.press = () => {
    //Change the cat's velocity when the key is pressed
    tank.vx = -5;
    tank.vy = 0;
  };
  
  //Left arrow key `release` method
  left.release = () => {
    //If the left arrow has been released, and the right arrow isn't down,
    //and the tank isn't moving vertically:
    //Stop the tank
    if (!right.isDown && tank.vy === 0) {
      tank.vx = 0;
    }
  };

  //Up
  up.press = () => {
    tank.vy = -5;
    tank.vx = 0;
  };
  up.release = () => {
    if (!down.isDown && tank.vx === 0) {
      tank.vy = 0;
    }
  };

  //Right
  right.press = () => {
    tank.vx = 5;
    tank.vy = 0;
  };
  right.release = () => {
    if (!left.isDown && tank.vy === 0) {
      tank.vx = 0;
    }
  };

  //Down
  down.press = () => {
    tank.vy = 5;
    tank.vx = 0;
  };
  down.release = () => {
    if (!up.isDown && tank.vx === 0) {
      tank.vy = 0;
    }
  };

  //Set the game state
  state = play;
 
  //Start the game loop 
  app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) {

  //Use the tank's velocity to make it move
  tank.x += tank.vx;
  tank.y += tank.vy
}