const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    fire: cc.Node = undefined
    @property(cc.SpriteFrame) 



    
    sm:cc.SpriteFrame = undefined

    private hitpower: number = 1
    private spx: number = 0
    private spy: number = 0
    private powerchange:boolean = false

    onLoad() {

        this.scheduleOnce(function () {
            this.fire.getComponent(cc.RigidBody).gravityScale = 5
        }, 1)
    }
    // onCollisionEnter(other, self) {
    //     // this.fire.active = false
    //     if (other.tag == 1 || other.tag == 4 || other.tag == 5) {
    //         this.fire.active = false
    //     }
    // }
    update() {
        // cc.log(this.hitpower)
        this.fire.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.spx, this.spy)

        if(this.powerchange){
            this.fire.getComponent(cc.Sprite).spriteFrame = this.sm
        }
    }
    onBeginContact(contact, self, other) {
        // self.node.destroy()
        if (other.tag == 10) {
            // cc.log("hit ground")
            let enemylife = other.node.getComponent('groundenemycontrol').life
            // cc.log(enemylife)
            if (enemylife >= 0) {
                self.node.destroy()
            } else {
                this.hitpower -= (enemylife + this.hitpower)
                this.powerchange = true
            }
        } else if (other.tag == 12) {
            // cc.log("hit sky")
            let enemylife = other.node.getComponent('skyenemycontrol').life
            // cc.log(enemylife)
            if (enemylife >= 0) {
                self.node.destroy()
            } else {
                this.hitpower -= (enemylife + this.hitpower)
                this.powerchange = true
            }
        } else {
            self.node.destroy()
        }

    }
    setside(speedx, speedy, power) {

        this.spx = speedx
        this.spy = speedy
        this.fire.getComponent(cc.RigidBody).linearVelocity = cc.v2(speedx, speedy)


        if (speedy > 0) {
            if (speedx > 0) {
                //右上
                this.fire.rotation = -45
            } else if (speedx < 0) {
                //左上
                this.fire.rotation = -135
            } else {
                //正上
                this.fire.rotation = -90
            }


        } else if (speedy < 0) {
            if (speedx > 0) {
                //右下
                this.fire.rotation = -315
            } else if (speedx < 0) {
                //左下
                this.fire.rotation = -225
            } else {
                //正下
                this.fire.rotation = -270
            }

        } else {
            //後
            if (speedx < 0) {
                // this.fire.setContentSize(50, -50)
                this.fire.rotation = -180
                // cc.log(this.fire.width)
            } else {
                //前
                this.fire.rotation = 0
            }

        }

        switch (power) {
            case 0:
                this.fire.scale = 1
                this.hitpower = 1
                break
            case 1:
                this.fire.scale = 1.2
                this.hitpower = 1.5
                break
            case 2:
                this.fire.scale = 1.4
                this.hitpower = 2
                break
            case 3:
                this.fire.scale = 1.6
                this.hitpower = 2.5
                break
            default:
                cc.log("default")
        }


    }
}
