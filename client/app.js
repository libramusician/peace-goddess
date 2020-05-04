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
let bullets = []
function setup() {

  //Create the `cat` sprite 
  tank = new PIXI.Sprite(app.loader.resources["tankImage"].texture);
  tank.anchor.y = 0.5; 
  tank.anchor.x = 0.5
  tank.vx = 0;
  tank.vy = 0;
  tank.x = 250
  tank.y = 450;
  let direction = 'U'; 
  app.stage.addChild(tank);

  //Capture the keyboard arrow keys
  let left = keyboard("ArrowLeft"),
      up = keyboard("ArrowUp"),
      right = keyboard("ArrowRight"),
      down = keyboard("ArrowDown"),
      space = keyboard(" ");
  space.press = () => {
      
    let temp = new PIXI.Graphics()
    temp.beginFill(0xFFCC00, 1)
    temp.drawCircle(tank.x,tank.y,2)
    temp.endFill()
     
    switch(direction){
      case 'U': 
        temp.vy = -2;
        temp.vx = 0;
        break;
      case 'L': 
        temp.vx = -2;
        temp.vy = 0;
        break;
      case 'D': 
        temp.vy = 2;
        temp.vx = 0;
        break;
      case 'R': 
        temp.vx = 2;
        temp.vy = 0;
        break;
    }
    bullets.push(temp)
    app.stage.addChild(temp)     
  }    

  //Left arrow key `press` method
  left.press = () => {
    //Change the cat's velocity when the key is pressed
    tank.vx = -5;
    tank.vy = 0;
    tank.rotation=-1.57;
    direction = 'L';  
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
    tank.rotation=0; 
    direction = 'U'; 
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
    tank.rotation=1.57 
    direction = 'R'; 
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
    tank.rotation=3.14
    direction = 'D'; 
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
  tank.y += tank.vy;
  
  bullets.forEach((bullet)=>{
    bullet.y += bullet.vy;
    bullet.x += bullet.vx;
  })
}