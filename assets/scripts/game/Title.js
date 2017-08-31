import {
  messagePipeline
} from 'MessagePipeline'

cc.Class({
  extends: cc.Component,

  properties: {},

  // use this for initialization
  onLoad: function () {
    this._animation = this.getComponent(cc.Animation)
    this._isClosing = false
  },

  $tapped() {
    if (this._isClosing) {
      return
    }
    this._isOpened = true
    this._animation.play()
    messagePipeline.sendMessage('GAME_RESET', this)
  }
});