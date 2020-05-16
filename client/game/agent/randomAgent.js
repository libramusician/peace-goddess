class RandomAgent{
    constructor(n){
        this.n = n > 1?n : 1
        this.repeat = n
        this.last = ''
        this.count = 0
    }
    getAction(agentStatus,gameInfo,actions){
        if(this.count>=this.n){
            this.last = actions[Math.floor(Math.random()*actions.length)]
            this.count = 0
        }
        this.count++
        return this.last
    }
}
module.exports = RandomAgent