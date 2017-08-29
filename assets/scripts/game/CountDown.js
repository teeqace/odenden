import {
  messagePipeline
} from 'MessagePipeline'

cc.Class({
  extends: cc.Component,

  properties: {
    filler: cc.Sprite,
    labelText: cc.Label,
    effect: cc.Animation
  },

  // use this for initialization
  onLoad: function () {
    this.time = 0
  },

  countDown(time) {
    this.time = time
    if (this.time <= 6 && this.time > 0) {
      this.node.x = 0
    } else {
      this.node.x = 1000
    }
  },

  update(dt) {
    if (this.time > 6 || this.time <= 0) {
      return
    }
    let dispTime = Math.floor(this.time)
    let nowDispTime = Number(this.labelText.string)
    if (dispTime < nowDispTime) {
      this.effect.play()
    }
    this.labelText.string = dispTime
    this.filler.fillRange = this.time - Math.floor(this.time)
  }
});