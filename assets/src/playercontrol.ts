const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property()
    jumppower: number = 0
    @property(cc.RigidBody)
    player: cc.RigidBody = undefined
    @property(cc.Sprite)
    playersprite: cc.Sprite = undefined
    @property(cc.SpriteFrame)
    stay01: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    stay02: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    stair01: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    stair02: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    attpose: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    hurtpose: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    jumppose: cc.SpriteFrame = undefined
    @property(cc.Node)
    hpbar: cc.Node = undefined
    @property(cc.Prefab)
    hp: cc.Prefab = undefined
    @property(cc.Node)
    control: cc.Node = undefined

    private shine: cc.Action = null
    private shinetype: boolean = false
    private jumptype: boolean = true
    private jumpobj: number = 1
    private objtype: boolean = false
    private objx: number = 0
    private stairtype: boolean = false
    private icegroundtype: boolean = false
    private hparray: Array<cc.Node> = []
    private atttype: boolean = true


    onLoad() {
        // init logic
        for (let i = 0; i < 5; i++) {
            this.addhp()
        }

        let hide = cc.fadeTo(0.3, 100)
        let show = cc.fadeTo(0.3, 255)
        this.shine = cc.sequence(hide, show, hide, show)

        cc.director.getPhysicsManager().enabled = true
        let changeimg = function () {
            if (!this.jumptype) {
                // cc.log('jump')
                return
            } else if (this.stairtype) {
                // cc.log('stair')
                if (this.playersprite.spriteFrame == this.stair01) {
                    this.playersprite.spriteFrame = this.stair02
                } else {
                    this.playersprite.spriteFrame = this.stair01
                }
                return
            } else if (!this.atttype) {
                // cc.log('att')
                return
            } else if (this.shinetype) {
                // cc.log('hurt')
                return
            } else {
                // cc.log('stay')
                if (this.playersprite.spriteFrame == this.stay01) {
                    this.playersprite.spriteFrame = this.stay02
                } else {
                    this.playersprite.spriteFrame = this.stay01
                }
                return
            }
        }


        this.schedule(changeimg, 0.5)

    }

    jump() {
        if (this.jumptype) {
            if (this.stairtype) {
                this.player.gravityScale = 10
                this.player.applyLinearImpulse(cc.v2(0, this.jumppower * 0.3), this.player.getLocalCenter(), true)
            } else {
                this.player.applyLinearImpulse(cc.v2(0, this.jumppower * this.jumpobj), this.player.getLocalCenter(), true)
            }
            this.playersprite.spriteFrame = this.jumppose
            this.jumptype = false
            this.objtype = false
            this.scheduleOnce(function () {
                this.objtype = false
            }, 0.05)
        }

    }
    // 只在两个碰撞体开始接触时被调用一次
    onBeginContact(contact, self, other) {
        // cc.log(self,this)
        if (other.tag == 1) {
            this.jumptype = true
            this.playersprite.spriteFrame = this.stay01
        } else if (other.tag == 2) {
            cc.log('hit stair')
            this.stairtype = true
            this.jumptype = true
            this.playersprite.spriteFrame = this.stair02
            this.node.parent.parent.getComponentInChildren('controll').stairtype = true
            this.player.gravityScale = 0
        } else if (other.tag == 3) {
            this.jumptype = true
            this.playersprite.spriteFrame = this.stay01
            this.objtype = true
            this.objx = this.node.x
        } else if (other.tag == 7) {
            // cc.log('hit iceground')
            this.jumptype = true
            this.icegroundtype = true
            this.playersprite.spriteFrame = this.stay01
        } else if (other.tag == 10 || other.tag == 11 || other.tag == 12 || other.tag == 13 || other.tag == 15) {
            if (!this.shinetype) {
                this.playersprite.spriteFrame = this.hurtpose
                self.node.runAction(this.shine)
                this.shinetype = true
                this.scheduleOnce(function () {
                    this.shinetype = false
                    this.playersprite.spriteFrame = this.stay01
                    // cc.log('hurt end')
                }, 1.2)
                this.delhp()
            }
        } else if (other.tag == 14) {
            if (!this.shinetype) {
                this.clearhp()
            }

        }

    }
    // 只在两个碰撞体结束接触时被调用一次
    onEndContact(contact, self, other) {
        if (other.tag == 1) {
        } else if (other.tag == 2) {
            cc.log('stair end')
            this.stairtype = false
            this.playersprite.spriteFrame = this.stay01
            this.node.parent.parent.getComponentInChildren('controll').stairtype = false
            this.player.gravityScale = 10
        } else if (other.tag == 3) {
            this.jumpobj = 1 + (other.node.getComponent('mapobject').ypocount) / 25
            this.scheduleOnce(function () {
                if (!this.objtype || Math.abs(this.node.x - this.objx) > 50) {
                    this.jumpobj = 1
                    other.node.getComponent('mapobject').reset()
                }
            }, 0.1)
        } else if (other.tag == 7) {
            this.icegroundtype = false
        }
    }
    // 每次将要处理碰撞体接触逻辑时被调用
    onPreSolve(contact, self, other) {
        if (other.tag == 1) {
            // cc.log("hit ground pre")
        } else if (other.tag == 2) {
            if (this.node.parent.parent.getComponentInChildren('controll').press && !this.jumptype) {
                // cc.log("up")
                this.stairtype = true
                this.jumptype = true
                this.playersprite.spriteFrame = this.stay01
                this.node.parent.parent.getComponentInChildren('controll').stairtype = true
                this.player.gravityScale = 0
            }
        } else if (other.tag == 3) {
            // this.objtype = true
            this.objx = this.node.x
        } else if (other.tag == 14) {
            if (!this.shinetype) {
                this.clearhp()
            }
        }
    }
    // 每次处理完碰撞体接触逻辑时被调用
    onPostSolve(contact, self, other) {
        if (other.tag == 2) {
            // this.player.linearVelocity = cc.v2(0,0)
        }
    }

    update() {
        // cc.log(this.control.getComponent('controll').attype)
        this.atttype = this.control.getComponent('controll').attype
        cc.log(this.player.linearVelocity)
    }
    // att(){
    //     this.atttype == false
    //     this.scheduleOnce(function () {
    //         this.attype = true
    //     }, 0.3)
    // }


    addhp() {
        if (this.hparray.length < 10) {
            let add = cc.instantiate(this.hp)
            this.hpbar.addChild(add)
            this.hparray[this.hparray.length] = add
            // cc.log(this.hparray.length)
        }
    }
    delhp() {
        if (this.hparray.length > 0) {
            this.hparray[this.hparray.length - 1].destroy()
            this.hparray.pop()
            // cc.log(this.hparray.length)
        }
    }
    clearhp() {
        if (this.hparray.length > 0) {
            let deltime = this.hparray.length
            for (let i = 0; i < deltime; i++) {
                this.delhp()
            }
        }

    }
}
