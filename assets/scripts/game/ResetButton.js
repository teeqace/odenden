import {
  messagePipeline
} from 'MessagePipeline'

cc.Class({
  extends: cc.Component,

  properties: {},

  // use this for initialization
  onLoad: function () {
    this._animation = this.getComponent(cc.Animation)
    this._isOpened = false
    messagePipeline.on('GAME_OVER', this._gameOver, this)
  },

  _gameOver(event, detail) {
    this._animation.play('LabelOpen')
  },

  _labelOpened() {
    this._isOpened = true
  },

  $buttonPressed() {
    if (!this._isOpened) {
      return
    }
    this._isOpened = false
    this._animation.play('LabelClose')
    messagePipeline.sendMessage('GAME_RESET', this)
  }
});