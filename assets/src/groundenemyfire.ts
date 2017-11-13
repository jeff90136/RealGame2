const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    fire: cc.Node = undefined


    private firespeedx: number = 0
    private firespeedy: number = 0

    onLoad() {

    }
    setspeed(x, y, side) {
        this.firespeedx = x
        this.firespeedy = y
        if (side) {
            this.fire.setContentSize(100, 75)
        }
    }
    update() {
        let speed = this.node.parent.parent.getComponent('groundenemycontrol').view.linearVelocity
        this.fire.getComponent(cc.RigidBody).linearVelocity = cc.v2(speed.x + this.firespeedx, speed.y + this.firespeedy)
    }
    onBeginContact(contact, self, other) {
        // cc.log(other.tag)
        if (other.tag == 0 || other.tag == 1 || other.tag == 5) {
            // cc.log("hit")
            self.node.destroy()
        }
    }
}
