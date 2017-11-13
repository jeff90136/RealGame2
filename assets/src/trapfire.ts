const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {


    @property(cc.RigidBody)
    trap: cc.RigidBody = undefined

    private startx:number = 0
    private starty:number = 0

    onLoad() {
        // init logic
        this.startx = this.node.x
        this.starty = this.node.y
        cc.director.getPhysicsManager().enabled = true
    }
    update() {
        let view = this.node.parent.parent.getComponent(cc.RigidBody)
        this.trap.linearVelocity = cc.v2(view.linearVelocity.x,view.linearVelocity.y-500)
    }
    onBeginContact(contact, self, other) {
        self.node.destroy()
    }
}
