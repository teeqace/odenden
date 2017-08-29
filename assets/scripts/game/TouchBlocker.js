import {
  messagePipeline
} from 'MessagePipeline'

cc.Class({
  extends: cc.Component,
  onLoad: function () {
    this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
      event.stopPropagation()
    }, this.node)
    messagePipeline.on('GAME_OPEN', this._blockOn, this)
    messagePipeline.on('GAME_START', this._blockOff, this)
    messagePipeline.on('GAME_OVER', this._blockOn, this)
  },

  _blockOff() {
    this.node.setScale(0)
  },

  _blockOn() {
    this.node.setScale(1)
  }
})