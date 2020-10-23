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
    success: {
      default: null,
      type: cc.Prefab,
    },
    touch: {
      default: null,
      url: cc.AudioClip
    },
    error: {
      default: null,
      url: cc.AudioClip
    },
    fail_ao: {
      default: null,
      url: cc.AudioClip
    },
    successAudio: {
      default: null,
      url: cc.AudioClip
    },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    let numbers = this.node.getChildByName("numbers");
    // 给numbers下所有子节点绑定点击事件
    numbers.children.forEach((childNode, index) => {
      childNode.on(cc.Node.EventType.MOUSE_DOWN, (event) => {
        //  选中时样式：当前节点透明度变为200
        childNode.opacity = 200;
        // 播放声音
        cc.audioEngine.playEffect(this.touch, false);
        // 发射numValue中监听的事件，并将节点和节点的属性值传给 Game 脚本
        this.node.emit("click", {
          value: childNode.getComponent("numValue").value,
          node: childNode,
          index: index,
        });
      });
    });

    // 设定错误提示的数字的位置和大小
    let numbers_error = this.node.getChildByName("numbers_error");
    numbers_error.children.forEach((childNode, index) => {
      childNode.width = 144;
      childNode.height = 162;
      childNode.x = numbers.children[index].x;
      childNode.y = numbers.children[index].y;
      // 开始时透明度先设为0
      childNode.opacity = 0;
    });

    // 给当前节点添加两个自定义属性
    this.a = null;
    this.b = null;

    // 监听事件
    this.node.on("click", (event) => {
      // 接受发射事件时传递的参数（当前点击的节点和节点的value属性
      let target = event.detail;

      // 每次点击都先做一个判断，如果target与this.b不一样，则将this.b的值给this.a，并将传递过来target的值给this.b，如果一样，则取消选定状态。
      if (this.b && this.b.value == target.value) {
        // 两次点击相同时，取消当前点击节点的选中状态
        target.node.opacity = 255; // 取消选中的效果
        this.b = null;
      } else {
        // 两次点击的节点不同，传值
        this.a = this.b;
        this.b = target;

        // 当this.a和this.b都存在时，对节点进行相关判断与操作
        if (this.a && this.b) {
          // 如果相加得9，配对成功，则两个节点都消失（透明度变为0）
          if (this.a.value + this.b.value == 9) {
            // 销毁配对成功的节点
            this.a.node.destroy();
            this.b.node.destroy();

            // FIXME 部分元素配对成功，还有未判定元素，未配对元素抖动，语音提示
            // BUG 为什么（初次）节点销毁之后，numbers子节点数还是10，但是他的数组的length显示的是8，输出的也是10
            // 为解决上述bug带来的问题，我们不得不将此代码放在配对成功的判断里
            if (
              numbers.children.length - 2 > 0 &&
              numbers.children.length - 2 < 10
            ) {
              numbers.children.forEach((childNode) => {
                childNode.runAction(this.shake(childNode)); // 抖动
                // 播放声音
                cc.audioEngine.playEffect(this.fail_ao, false);
              });
            }

            // FIXME 所有元素配对成功，语音提示，显示成功图片，界面不让操作。
            // 为解决上述bug带来的问题，我们不得不将此代码放在配对成功的判断里
            if (numbers.childrenCount - 2 === 0) {
              this.gameOver();
              // 播放声音
              cc.audioEngine.playEffect(this.successAudio, false);
            }
          } else {
            // 如果相加不得9，两个节点闪红，然后取消选中
            // FIXME 加效果
            numbers_error.children[this.a.index].runAction(this.flashRed());
            numbers_error.children[this.b.index].runAction(this.flashRed());
            this.a.node.opacity = 255;
            this.b.node.opacity = 255;

            // FIXME 所有元素都没有配对成功，所有元素闪红，语音提示。
            // BUG 由于numbers子节点数刷新不及时，所以我们只能把这一步放在这里了，以解决第一次配对失败时和第一次配对成功时子节点数都显示10的问题
            if (numbers.childrenCount === 10) {
              numbers_error.children.forEach((childNode) => {
                childNode.runAction(this.flashRed()); // 闪红
                // 播放声音
                cc.audioEngine.playEffect(this.error, false);
              });
            }
          }
          this.a = this.b = null;
        }
      }
    });
  },

  // 数字闪红的方法
  flashRed() {
    let fadeIn = cc.fadeIn(0.2);
    let fadeOut = cc.fadeOut(0.2);
    return cc.repeat(cc.sequence(fadeIn, fadeOut), 2);
  },

  // 抖动的方法
  shake(node) {
    let toLeft = cc.moveTo(0.05, cc.p(node.x - 10, node.y)),
      back = cc.moveTo(0.05, cc.p(node.x, node.y)),
      toRight = cc.moveTo(0.05, cc.p(node.x + 10, node.y));
    return cc.sequence(toLeft, back, toRight, back);
  },

  // 游戏结束的方法
  gameOver() {
    // 加载 gameOver 的 prefab
    let success = cc.instantiate(this.success);
    this.node.addChild(success);
    success.setPosition(cc.p(0, 0));
    // 终止所有动作
    this.node.stopAllActions();
  },

  start() {},

  // update (dt) {},
});
