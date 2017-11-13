const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.RigidBody)
    view: cc.RigidBody = undefined
    @property(cc.Node)
    mov: cc.Node = undefined
    @property(cc.RigidBody)
    player: cc.RigidBody = undefined
    @property(cc.Node)
    map: cc.Node = undefined
    @property(cc.Node)
    bulletoutput: cc.Node = undefined
    @property(cc.Prefab)
    bullet: cc.Prefab = undefined
    @property(cc.Node)
    attbutton: cc.Node = undefined
    @property(cc.SpriteFrame)
    attpose: cc.SpriteFrame = undefined
    @property(cc.SpriteFrame)
    stay01: cc.SpriteFrame = undefined



    private movpress: boolean = false
    private playerspeed = cc.v2(0, 0)
    // private jumptype: boolean = true
    private playercontrol: boolean = true
    private icemapx: Array<number> = [5500, 5500, 5500, 5500, 2250, 2250, 2250, -3250, -3250, -5900, -5900, -7500]
    private icemapy: Array<number> = [1100, 1100, 1200, 1050, 1100, 1100, 1250, -1100, -1150, -1100, -1200]
    private icemapcount: number = 0
    private stairtype: boolean = false
    private keyspeedx: number = 0
    private keyspeedy: number = 0
    private jumpspeed: number = 0
    private stairspeed: number = 0
    private press: boolean = false
    private attype: boolean = true
    private power: number = 0
    private powertype: boolean = false
    private icespeed: number = 0



    onLoad() {
        // init logic
        cc.director.getPhysicsManager().enabled = true
        //類比搖桿
        this.mov.on(cc.Node.EventType.TOUCH_START, function () {
            this.movpress = true
        })
        let movposition = function (event) {
            let x = event.touch.getLocation().x
            let y = event.touch.getLocation().y
            // cc.log(x,y)

            let rang = (x - (200)) * (x - (200)) + (y - (200)) * (y - (200))
            if (Math.pow(rang, 0.5) > 100) {
                // cc.log("over")
                let cur = Math.atan2((y - (200)), (x - (200)))
                this.mov.x = 100 * Math.cos(cur) + (200)
                this.mov.y = 100 * Math.sin(cur) + (200)
            } else {
                this.mov.x = x
                this.mov.y = y
            }
        }
        this.mov.on(cc.Node.EventType.TOUCH_MOVE, movposition, this)

        let movend = function () {
            let back = cc.moveTo(0.1, cc.p((200), (200)))
            this.mov.runAction(back)
            this.movpress = false
            // cc.log("end")
        }
        this.mov.on(cc.Node.EventType.TOUCH_END, movend, this)
        this.mov.on(cc.Node.EventType.TOUCH_CANCEL, movend, this)


        //keyboard
        let movleft = function () {
            switch (event.keyCode) {
                case cc.KEY.a:
                    this.keyspeedx = -500
                    break;
                case cc.KEY.s:
                    this.keyspeedy = -500
                    break;
            }

        }
        let movright = function () {
            switch (event.keyCode) {
                case cc.KEY.d:
                    this.keyspeedx = 500
                    break;
                case cc.KEY.w:
                    this.keyspeedy = 500
                    this.press = true
                    break;
            }
        }
        let movstop = function () {
            switch (event.keyCode) {
                case cc.KEY.a:
                    this.keyspeedx = 0
                    break;
                case cc.KEY.d:
                    this.keyspeedx = 0
                    break;
                case cc.KEY.w:
                    this.keyspeedy = 0
                    this.press = false
                    break;
                case cc.KEY.s:
                    this.keyspeedy = 0
                    break;
            }
        }
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, movleft, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, movright, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, movstop, this)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, movstop, this)

        //attpower
        let addpower = function () {
            this.power += 1
            if (this.power >= 3) {
                this.unschedule(addpower)
            }
        }

        let powerstart = function () {
            this.schedule(addpower, 1)
            this.powertype = true
            // cc.log("start")
        }
        this.attbutton.on(cc.Node.EventType.TOUCH_START, powerstart, this)

        let powerend = function () {
            this.powertype = false
            this.unschedule(addpower)
            this.scheduleOnce(function () {
                this.power = 0
            }, 0.1)

        }
        this.attbutton.on(cc.Node.EventType.TOUCH_END, powerend, this)
        this.attbutton.on(cc.Node.EventType.TOUCH_CANCEL, powerend, this)

    }

    update() {
        // cc.log(this.power, this.powertype)
        // cc.log(this.mov.x,this.mov.y,this.movpress)
        // cc.log(this.bulletoutput.position,this.player.node.position)
        if (Math.abs(this.mov.x - 200) < 1 && !this.movpress) {
            this.mov.x = 200
        }
        if (Math.abs(this.mov.y - 200) < 1 && !this.movpress) {
            this.mov.y = 200
        }

        this.playerspeed = this.player.linearVelocity
        let playerjump = this.node.parent.getComponentInChildren('playercontrol').jumptype
        // 人物控制 x
        if (playerjump) {
            if (this.keyspeedx == 0) {
                this.jumpspeed = (this.mov.x - (200)) * 5
            } else {
                this.jumpspeed = this.keyspeedx
            }

        } else {
            if (this.keyspeedx == 0) {
                this.jumpspeed = (this.mov.x - (200)) * 3.5
            } else {
                this.jumpspeed = this.keyspeedx
            }
            // jumpspeed = (this.mov.x - (200)) * 3.5
        }
        // 人物控制 y
        // 樓梯控制
        if (this.mov.y - 200 > 0) {
            this.press = true
        } else {
            this.press = false
        }
        if (this.stairtype && playerjump) {
            if (this.keyspeedy == 0) {
                this.stairspeed = (this.mov.y - (200)) * 3
                this.jumpspeed = 0
            } else {
                this.stairspeed = this.keyspeedy
                this.jumpspeed = 0
            }
        } else {
            this.stairspeed = this.playerspeed.y
        }
        //icegroundspeed
        let icegroundtype = this.player.node.getComponent('playercontrol').icegroundtype
        // cc.log(icegroundtype)
        if (icegroundtype) {
            if (this.jumpspeed > 0) {
                this.icespeed = 200
            } else if (this.jumpspeed < 0) {
                this.icespeed = -200
            }
        } else {
            this.icespeed = 0
        }

        this.player.linearVelocity = cc.v2(this.jumpspeed + this.icespeed, this.stairspeed)

        // 人物前後切換
        if (this.player.linearVelocity.x < 0) {
            this.player.node.setContentSize(100, 150)
        } else if (this.player.linearVelocity.x > 0) {
            this.player.node.setContentSize(-100, 150)
        }

        // 場景控制
        if (this.player.node.getPositionX() >= 0 && this.player.linearVelocity.x > 0 && this.view.node.getPositionX() >= this.icemapx[this.icemapcount]) {
            // this.player.linearVelocity = cc.v2((this.mov.x - (200)) * 5, this.playerspeed.y)
            // cc.log("go")
            this.view.linearVelocity = cc.v2(-this.player.linearVelocity.x, 0)
            this.player.linearVelocity = cc.v2(0, this.playerspeed.y)
            // cc.log(this.view.linearVelocity.x)
            //場景切換down
        } else if (this.player.node.getPositionY() <= -500 && this.playercontrol) {
            this.playercontrol = false
            this.player.linearVelocity = cc.v2(0, 0)
            this.player.gravityScale = 0
            this.scheduleOnce(function () {
                this.player.gravityScale = 10
                this.player.linearVelocity = cc.v2(0, -10)
                this.scheduleOnce(function(){
                    this.player.linearVelocity = cc.v2(0, 0)
                },0.1)
                this.playercontrol = true
            }, 1)
            this.player.node.runAction(cc.moveBy(1, cc.p(0, 950)))
            this.changelevel()
            //場景切換up
        } else if (this.player.node.getPositionY() >= 500 && this.playercontrol) {
            this.playercontrol = false
            this.player.linearVelocity = cc.v2(0, 0)
            this.player.gravityScale = 0
            this.scheduleOnce(function () {
                this.player.gravityScale = 10
                this.player.linearVelocity = cc.v2(0, 10)
                this.scheduleOnce(function(){
                    this.player.linearVelocity = cc.v2(0, 0)
                },0.1)
                this.playercontrol = true
            }, 1)
            this.player.node.runAction(cc.moveBy(1, cc.p(0, -900)))
            this.changelevel()
        } else {
            this.view.linearVelocity = cc.v2(0, 0)
        }

    }
    changelevel() {
        if (this.icemapcount < 7) {
            if (this.icemapcount % 2 == 0) {
                if (this.player.node.getPositionX() > 0) {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, this.icemapy[this.icemapcount])))
                    this.icemapcount += 1
                } else {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, -this.icemapy[this.icemapcount - 1])))
                    this.icemapcount -= 1
                }
            } else {
                if (this.player.node.getPositionX() > 0) {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, -this.icemapy[this.icemapcount - 1])))
                    this.icemapcount -= 1
                } else {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, this.icemapy[this.icemapcount])))
                    this.icemapcount += 1
                }
            }
        } else {
            if (this.icemapcount % 2 == 1) {
                if (this.player.node.getPositionX() > 0) {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, this.icemapy[this.icemapcount])))
                    this.icemapcount += 1
                } else {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, -this.icemapy[this.icemapcount - 1])))
                    this.icemapcount -= 1
                }
            } else {
                if (this.player.node.getPositionX() > 0) {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, -this.icemapy[this.icemapcount - 1])))
                    this.icemapcount -= 1
                } else {
                    this.view.node.runAction(cc.moveBy(1, cc.p(0, this.icemapy[this.icemapcount])))
                    this.icemapcount += 1
                }
            }
        }
    }

    attact() {
        if (this.attype) {
            this.attype = false
            this.player.node.getComponent('playercontrol').playersprite.spriteFrame = this.attpose
            // cc.log(this.player.node.getComponent('playercontrol').attype)
            // this.player.node.getComponent('playercontrol').attype = false
            // cc.log(this.player.node.getComponent('playercontrol').attype)
            this.scheduleOnce(function () {
                this.player.node.getComponent('playercontrol').playersprite.spriteFrame = this.stay01
                this.attype = true
                // this.player.node.getComponent('playercontrol').attype = true
            }, 0.3)
            
            let addbullet = cc.instantiate(this.bullet)


            //方向
            if (this.mov.y - 200 > 50 || this.keyspeedy > 0) {
                if (this.mov.x - 200 > 50 || this.keyspeedx > 0) {
                    //右上
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX() + 50, this.player.node.getPositionY())
                    addbullet.getComponent('bulletcontrol').setside(1000, 1000, this.power)
                } else if (this.mov.x - 200 < -50 || this.keyspeedx < 0) {
                    //左上
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX() - 50, this.player.node.getPositionY())
                    addbullet.getComponent('bulletcontrol').setside(-1000, 1000, this.power)
                } else {
                    //正上
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX(), this.player.node.getPositionY() + 75)
                    addbullet.getComponent('bulletcontrol').setside(0, 1000, this.power)
                }
            } else if (this.mov.y - 200 < -50 || this.keyspeedy < 0) {
                if (this.mov.x - 200 > 50 || this.keyspeedx > 0) {
                    //右下
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX() + 50, this.player.node.getPositionY())
                    addbullet.getComponent('bulletcontrol').setside(1000, -1000, this.power)
                } else if (this.mov.x - 200 < -50 || this.keyspeedx < 0) {
                    //左下
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX() - 50, this.player.node.getPositionY())
                    addbullet.getComponent('bulletcontrol').setside(-1000, -1000, this.power)
                } else {
                    //正下
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX(), this.player.node.getPositionY() - 75)
                    addbullet.getComponent('bulletcontrol').setside(0, -1000, this.power)
                }
            } else {
                if (this.player.node.width <= 0) {
                    //前
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX() + 50, this.player.node.getPositionY())
                    addbullet.getComponent('bulletcontrol').setside(1000, 0, this.power)
                } else {
                    //後
                    this.bulletoutput.position = cc.v2(this.player.node.getPositionX() - 50, this.player.node.getPositionY())
                    addbullet.getComponent('bulletcontrol').setside(-1000, 0, this.power)
                }
            }
            this.bulletoutput.addChild(addbullet)

        }
    }


}
