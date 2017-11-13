const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RigidBody)
    view: cc.RigidBody = undefined

    @property(cc.RigidBody)
    enemy: cc.RigidBody = undefined

    @property()
    life: number = 0

    @property()
    attoption: boolean = false

    @property(cc.Node)
    enemyfireoutput: cc.Node = undefined

    @property(cc.Prefab)
    enemyfire: cc.Prefab = undefined

    @property()
    shutplayer: boolean = false

    @property()
    moveoption: boolean = false

    @property()
    moverang: number = 0

    @property()
    movetime: number = 0

    private shine: cc.Action = null
    private shinetype: boolean = false
    private startx: number = 0
    private starty: number = 0
    private movex: number = 0
    private movey: number = 0
    //加速度
    private dx: number = 25
    private dy: number = 40
    //delay count
    private dcount: number = 5 

    onLoad() {
        // init logic
        this.startx = this.node.x
        this.starty = this.node.y

        // this.ypo = this.yposition
        cc.director.getPhysicsManager().enabled = true
        let hide = cc.fadeTo(0.15, 100)
        let show = cc.fadeTo(0.15, 255)
        this.shine = cc.sequence(hide, show, hide, show)
        if (this.attoption) {
            this.schedule(function () {
                let fire = cc.instantiate(this.enemyfire)
                if (this.shutplayer) {
                    let playerposition = this.node.parent.parent.getComponentInChildren('playercontrol').node.position
                    let cur = Math.atan2((this.node.y - playerposition.y), (this.node.x - playerposition.x))
                    fire.rotation = -((cur * 180 / Math.PI) - 90)
                    // this.enemyfireoutput.position = cc.v2(this.enemy.node.getPositionX(), this.enemy.node.getPositionY() - 50)
                    // this.bulletoutput.position = cc.v2(this.player.node.getPositionX() + 50, this.player.node.getPositionY())
                    fire.getComponent('skyenemyfire').setspeed(-500 * Math.cos(cur), -450 * Math.sin(cur))
                } else {
                    // this.enemyfireoutput.position = cc.v2(this.enemy.node.getPositionX(), this.enemy.node.getPositionY() - 50)
                    fire.getComponent('skyenemyfire').setspeed(0, -500)
                }
                // fire.getComponent('skyenemyfire').setspeed(0, -500)
                this.enemyfireoutput.addChild(fire)
            }, 1)

        }

        // if (this.moveoption) {
            //初速
            // this.movex = this.moverang/2
            // this.movey = this.moverang/2
            // cc.log("run")
        // }
    }
    update() {
        if (this.moveoption && this.dcount == 0) {
            this.dcount = 5
        // 拋物線式移動
            // if (this.movex > this.moverang) {
            //     this.movex = this.moverang
            //     this.dx = 1 / this.dx
            // } else if (this.movex < 10 && this.movex > 0) {
            //     this.movex = -10
            //     this.dx = 1 / this.dx
            // } else if (this.movex < -this.moverang) {
            //     this.movex = -this.moverang
            //     this.dx = 1 / this.dx
            // } else if (this.movex > -10 && this.movex < 0) {
            //     this.movex = 10
            //     this.dx = 1 / this.dx
            // }
            // this.movex *= this.dx
            // // cc.log(this.movex,this.dx)

            // if (this.movey > this.moverang) {
            //     this.movey = this.moverang
            //     this.dy = 1 / this.dy
            // } else if (this.movey < 1 && this.movey > 0) {
            //     this.movey = -1
            //     this.dy = 1 / this.dy
            // } else if (this.movey < -this.moverang) {
            //     this.movey = -this.moverang
            //     this.dy = 1 / this.dy
            // } else if (this.movey > -1 && this.movey < 0) {
            //     this.movey = 1
            //     this.dy = 1 / this.dy
            // }
            // this.movey *= this.dy
            // cc.log(this.movey,this.dy)

        // 一般移動
            if (this.movex > this.moverang) {
                this.movex = this.moverang
                this.dx = - this.dx
            } else if (this.movex < -this.moverang) {
                this.movex = -this.moverang
                this.dx = - this.dx
            }
            this.movex += this.dx
        }
        this.dcount -= 1
        this.enemy.linearVelocity = cc.v2(this.view.linearVelocity.x + this.movex, this.view.linearVelocity.y + this.movey)
        this.enemy.node.setPositionY(this.starty)
    }

    onBeginContact(contact, self, other) {
        if (other.tag == 5) {
            if(!this.shinetype){
                self.node.runAction(this.shine)
                this.shinetype = true
                this.scheduleOnce(function(){
                    this.shinetype = false
                },0.6)
            }
            let hurt = other.node.getComponent('bulletcontrol').hitpower
            // cc.log(hurt)
            this.life -= hurt
            if (this.life <= 0) {
                this.node.destroy()
            }
        } else if (other.tag == 99) {
            this.node.destroy()
        }
    }
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, self, other) {

    }
    onPreSolve(contact, self, other) {

    }
}
