const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    trapoutput: cc.Node = undefined
    @property(cc.Prefab)
    trapfire: cc.Prefab = undefined

    onLoad() {
        // init logic
        this.schedule(this.addtrapfire,2)
        // cc.log(this.node.position)
    }

    addtrapfire(){
        let trap = cc.instantiate(this.trapfire)
        this.trapoutput.addChild(trap)
        // cc.log("add")
    }
}
