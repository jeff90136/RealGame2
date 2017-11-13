const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RigidBody)
    trap: cc.RigidBody = undefined
    @property()
    delaytime: number = 0
    @property()
    droprange: number = 0
    @property(cc.Node)
    line: cc.Node = undefined


    private startx: number = 0
    private starty: number = 0

    private movspeedx: number = 0
    private movspeedy: number = 0
    private movtype: boolean = true
    onLoad() {
        // init logic
        this.startx = this.node.x
        this.starty = this.node.y
        // this.movspeedy = -this.droprange
        cc.director.getPhysicsManager().enabled = true

        // let drop = cc.moveTo(1, cc.p(this.startx, this.starty - this.droprange))

        // let up = cc.moveTo(3, cc.p(this.startx, this.starty))
        // let drop = cc.moveBy(1, cc.p(0, -this.droprange))

        // let up = cc.moveBy(3, cc.p(0, this.droprange))
        this.scheduleOnce(function () {
            this.movtype = false
        }, this.delaytime / 3)

        this.schedule(function () {
            // this.node.runAction(cc.sequence(drop, up))
            // if (this.movspeedy == 0) {
            //     this.movspeedy = -this.droprange
            // } else {
            //     this.movspeedy = 0
            // }
            // if (this.movtype) {
            //     this.movtype = false
            // } else {
            //     this.movtype = true
            // }
            this.movtype = true
            this.scheduleOnce(function () {
                this.movtype = false
            }, this.delaytime / 3)
        }, this.delaytime)
    }
    update() {
        let view = this.node.parent.getComponent(cc.RigidBody)
        // cc.log(view.linearVelocity.x)
        // this.trap.linearVelocity = cc.v2(view.linearVelocity.x + this.movspeedx, this.movspeedy)
        this.line.setContentSize(50 + Math.abs(this.node.getPositionY() - this.starty), 14)
        // cc.log(this.node.parent.position)

        if (this.movtype) {
            this.movspeedy -= this.droprange/50*2
        } else {
            this.movspeedy += this.droprange/50
        }



        this.trap.node.setPositionY(this.starty + this.movspeedy)
        this.trap.node.setPositionX(this.startx)
        // cc.log(this.node.position)

    }

    // addtrapfire() {
    //     let trap = cc.instantiate(this.trapfire)
    //     this.trapoutput.addChild(trap)
    //     // cc.log("add",trap.position)
    // }
}
