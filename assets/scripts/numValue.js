// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
  extends: cc.Component,

  properties: {
    value: {
      default: 0,
      type: cc.Integer,
      readonly: true
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this.value = Number(this.node.name);
    // 添加监听事件，当点击同一个节点时，取消选中状态
    // this.node.on("cancel", (event)=>{
    //     this.node.opacity = 255;
    // })
  },

  start() {},

  // update (dt) {},
});
