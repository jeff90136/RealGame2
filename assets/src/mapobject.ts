const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RigidBody)
    view: cc.RigidBody = undefined

    @property(cc.RigidBody)
    ob: cc.RigidBody = undefined

    // @property(cc.Node)
    // door: cc.Node = undefined

    // @property()
    // yposition: number = 0

    private ypo: number = 0
    private ypocount: number = 0
    private startx: number = 0
    private starty: number = 0

    onLoad() {
        // init logic
        this.startx = this.node.x
        this.starty = this.node.y
        this.ypo = this.starty
        cc.director.getPhysicsManager().enabled = true
    }
    update() {
        // cc.log(this.ob.node.position)
        if (this.ypocount == 0) {
            this.ob.node.setPosition(this.startx, this.starty)
        } else {
            this.ob.linearVelocity = this.view.linearVelocity
            this.ob.node.setPositionY(this.ypo)
        }


        // this.ob.node.setPosition(this.startx,this.starty)
    }

    reset() {
        // cc.log(this.jum)
        // if (this.jum) {
        // cc.log("in")
        // this.jum = true
        this.ypocount = 0
        this.ypo = this.starty
        this.ob.node.height = 150
        //     cc.log(this.ypocount,this.ob.node.height,this.ob.node)
        // }

    }
    onBeginContact(contact, self, other) {
        // cc.log(self,this)
        if (other.tag == 0) {
            if (self.tag == 1) {
                cc.log("1")
            } else if (self.tag == 2) {
                cc.log("2")
                // this.door.setPositionX(-100)
            } else if (self.tag == 3) {
                cc.log("3")
                if (this.ypocount < 50) {
                    this.ypocount += 1
                    this.ypo -= 1
                    // this.jum = false
                    // cc.log(this.jum)
                    self.node.height -= 1
                }
            } else if (self.tag == 4) {
                // this.door.setPositionX(-100)
            }
        }
    }
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, self, other) {
        if (other.tag == 1) {
            cc.log("end")
        } else if (self.tag == 2 && other.tag == 0) {
            // this.door.setPositionX(200)
            cc.log("stair end")
            // this.node.parent.parent.getComponentInChildren('controll').stairtype = false
            // this.player.gravityScale = 10
            // cc.log("hit wall end")
        } else if (other.tag == 3) {
            cc.log("end")
            // this.jum = true
            // this.scheduleOnce(this.reset,0.5)
            // this.jumpobj = 1 + (other.node.getComponent('mapobject').ypocount) / 25
        } else if (self.tag == 4) {
            // this.door.setPositionX(100)
        }
    }
    onPreSolve(contact, self, other) {
        if (other.tag == 1) {
            // cc.log("hit ground pre")
        } else if (self.tag == 2) {
            // this.scheduleOnce(function () {
            // cc.log(this.node.parent.parent.getComponentInChildren('controll').press,this.jumptype)
            // if (this.node.parent.parent.getComponentInChildren('controll').press && !this.jumptype) {
            //     cc.log("up")
            //     this.stairtype = true
            //     this.jumptype = true
            //     this.node.parent.parent.getComponentInChildren('controll').stairtype = true
            //     this.player.gravityScale = 0
            // }
            // }, 0.2)
        } else if (other.tag == 3) {
            // this.objtype = true
            // this.objx = this.node.x
        } else if (self.tag == 4) {
            // this.door.runAction(cc.moveBy(0,cc.p(-100,0)))
        }
    }
}
