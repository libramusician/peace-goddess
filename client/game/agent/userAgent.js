const keyboard = require('../utils/key').keyboard;

class UserAgent{
    constructor(leftKey,rightKey,upKey,downKey,fireKey){
        this['left'] =false
        this['right'] =false
        this['down'] =false
        this['up'] =false
        this['fire'] =false
        let self = this
        // helper function to set up keys
        const mapKey = (keyName,enableField,disableFields) => {
            let key = keyboard(keyName)
            key.press = ()=>{
                self[enableField] = true
                for(let disableField of disableFields){
                    self[disableField] = false
                }
            }
            key.release = ()=>{
                self[enableField] = false
            }
        }
        const directions = ['left','right','down','up']
        mapKey(leftKey,'left',directions.filter((d)=>d!=='left'))
        mapKey(rightKey,'right',directions.filter((d)=>d!=='right'))
        mapKey(upKey,'up',directions.filter((d)=>d!=='up'))
        mapKey(downKey,'down',directions.filter((d)=>d!=='down'))
        mapKey(fireKey,'fire',[])
    }
    getAction(agentStatus,gameInfo,actions){
        // map keys to actions use 2*3*3 matrix
        let a = this.left? 0 : this.right? 2 : 1 
        let b = this.up? 0 : this.down? 2 : 1
        let c = this.fire? 1: 0
        let res = actions[c*9+b*3+a]
        //reset fire
        this.fire = false
        // return
        return res
    }
}
module.exports = UserAgent