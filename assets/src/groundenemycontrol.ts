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

    onLoad() {
        // init logic
        this.startx = this.node.x
        this.starty = this.node.y
        // this.ypo = this.yposition
        cc.director.getPhysicsManager().enabled = true
        let hide = cc.fadeTo(0.15, 100)
        let show = cc.fadeTo(0.15, 255)
        this.shine = cc.sequence(hide, show, hide, show)
        // 攻擊
        if (this.attoption) {
            this.schedule(function () {
                let fire = cc.instantiate(this.enemyfire)
                if (this.movex <= 0) {
                    fire.getComponent('groundenemyfire').setspeed(-500, 0, false)
                } else {
                    fire.getComponent('groundenemyfire').setspeed(500, 0, true)
                }
                this.enemyfireoutput.addChild(fire)
            }, 2)
        }
        //徘徊移動
        if (this.moveoption) {
            this.schedule(function () {
                this.movex = -this.moverang
                this.scheduleOnce(function () {
                    this.movex = 0
                }, this.movetime)
                this.scheduleOnce(function () {
                    this.movex = this.moverang
                }, this.movetime + 1)
                this.scheduleOnce(function () {
                    this.movex = 0
                }, this.movetime * 3 + 1)
                this.scheduleOnce(function () {
                    this.movex = -this.moverang
                }, this.movetime * 3 + 2)
            }, this.movetime * 4 + 2)
        }
    }
    update() {
        // cc.log(this.ob.node.position)
        this.enemy.linearVelocity = cc.v2(this.view.linearVelocity.x + this.movex, this.view.linearVelocity.y + this.movey)
        this.enemy.node.setPositionY(this.starty)

        // cc.log(this.movex)
        // 方向
        if (this.movex <= 0) {
            this.node.setContentSize(100, 150)
        } else {
            this.node.setContentSize(-100, 150)
        }
    }

    // reset() {
    //     cc.log("in")
    //     this.ypocount = 0
    //     this.ypo = this.yposition
    //     this.enemy.node.height = 150

    // }
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
