const PIXI = require('pixi.js');
const UserAgent = require('./game/agent/userAgent')
const RandomAgent = require('./game/agent/randomAgent')

const gameWidth = 512
const gameHeight = 512
// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container
const app = new PIXI.Application()
app.renderer.autoResize = true
app.renderer.resize(512,512)
let tanks = [];
let bullets = [];
const bulletSpeed = 10
const actions = [
'LEFT_UP','UP','RIGHT_UP',
'LEFT','','RIGHT',
'LEFT_DOWN','DOWN','RIGHT_DOWN',
'LEFT_UP_FIRE','UP_FIRE','RIGHT_UP_FIRE',
'LEFT_FIRE','FIRE','RIGHT_FIRE',
'LEFT_DOWN_FIRE','DOWN_FIRE','RIGHT_DOWN_FIRE'
]

const createTank = (sprite,agent,x,y)=>{
  let tank = sprite
  tank.agent = agent
  tank.vx = 0
  tank.vy = 0
  tank.direction = 'U'
  tank.fireBullet = ()=>{
    let circle = new PIXI.Graphics()
    circle.beginFill(0xFFCC00, 1)
    circle.drawCircle(2,2,2)
    circle.endFill()
    temp = new PIXI.Sprite(app.renderer.generateTexture(circle))

    temp.x=tank.x
    temp.y=tank.y
    switch(tank.direction){
      case 'U': 
        temp.vy = -bulletSpeed;
        temp.vx = 0;
        temp.y -= tank.height/2
        temp.x -= tank.width/16 //adjust position
        break;
      case 'L': 
        temp.vx = -bulletSpeed;
        temp.vy = 0;
        temp.x -= tank.width/2
        break;
      case 'D': 
        temp.vy = bulletSpeed;
        temp.vx = 0;
        temp.y += tank.height/2
        break;
      case 'R': 
        temp.vx = bulletSpeed;
        temp.vy = 0;
        temp.x += tank.width/2
        temp.y -= tank.height/16 //adjust position
        break;
      default:
        console.log('wrong dir')
    }
    bullets.push(temp)
    app.stage.addChild(temp)
  }
  tank.anchor.x = 0.5
  tank.anchor.y = 0.5
  tank.x = x? x : 256
  tank.y = y? y : 256
  return tank
}


//load resources
app.loader.add('tankImage','/images/tank.png').load(setup)

// inject into div of html
document.querySelector('#game').appendChild(app.view)
function testInside (point,obj){
    let x = point.x,
        y = point.y;
    if (x>obj.x-obj.width/2
     && x<obj.x+obj.width/2
     && y<obj.y+obj.height/2
     && y>obj.y-obj.height/2)
     {return true;}
     else{return false;}
  }
  function hit (obj1,obj2){
    let upleft = {x:obj1.x-obj1.width/2,
                  y:obj1.y-obj1.height/2};
    let upright = {x:obj1.x+obj1.width/2,
                  y:obj1.y-obj1.height/2};
    let downleft = {x:obj1.x-obj1.width/2,
                  y:obj1.y+obj1.height/2};
    let downright = {x:obj1.x+obj1.width/2,
                    y:obj1.y+obj1.height/2};

    return (testInside(upleft,obj2)
    ||testInside(upright,obj2)
    ||testInside(downleft,obj2)
    ||testInside(downright,obj2))
  }
let state 
function setup() {
  let player = createTank(
    new PIXI.Sprite(app.loader.resources["tankImage"].texture),
    new UserAgent("ArrowLeft","ArrowRight","ArrowUp","ArrowDown"," "))
  let robot1 = createTank(new PIXI.Sprite(app.loader.resources["tankImage"].texture),new RandomAgent(20))
  tanks.push(player)
  tanks.push(robot1)
  // load tanks
  for(let tank of tanks){
    app.stage.addChild(tank);
  }

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
  if (hit(tanks[0],tanks[1])){console.log("haha")};
  //update tank
  tanks.forEach((tank)=>{
    // handle action (four directions)
    let act = tank.agent.getAction({},{},actions)
    switch(act.split('_')[0]){
      case 'LEFT':
        tank.vx = -5;
        tank.vy = 0;
        tank.rotation=-1.57;
        tank.direction = 'L';  
        break
      case 'RIGHT':
        tank.vx = 5;
        tank.vy = 0;
        tank.rotation=1.57 
        tank.direction = 'R'; 
        break
      case 'UP':
        tank.vy = -5;
        tank.vx = 0;
        tank.rotation=0; 
        tank.direction = 'U'; 
        break
      case 'DOWN':
        tank.vy = 5;
        tank.vx = 0;
        tank.rotation=3.14
        tank.direction = 'D'; 
        break
      default:
        tank.vx = tank.vy = 0;
    }
    if(act.endsWith('FIRE')){
      tank.fireBullet()
    }
    let newx = tank.x + tank.vx
    let newy = tank.y + tank.vy
    if (newx >=0 && newx <=gameWidth){
      tank.x = newx
    }
    if (newy >=0 && newy <=gameHeight){
      tank.y = newy
    }
  })
  
  bullets.forEach((bullet)=>{
    bullet.y += bullet.vy;
    bullet.x += bullet.vx;
    if(bullet.x<-5 || bullet.x>gameWidth+5 || bullet.y<-5 || bullet.y>gameHeight+5){
      bullet.markForRemoval = true
    }
  })
  //remove bullets from stage
  bullets.filter(bullet=>bullet.markForRemoval ).forEach((bullet)=>{
    app.stage.removeChild(bullet)
  })
  //shorten the list
  bullets = bullets.filter(bullet=>!bullet.markForRemoval)
  
  
}
