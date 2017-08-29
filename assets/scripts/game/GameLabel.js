import {
  messagePipeline
} from 'MessagePipeline'

cc.Class({
  extends: cc.Component,

  properties: {
    labelText: cc.Label
  },

  // use this for initialization
  onLoad: function () {
    this._animation = this.getComponent(cc.Animation)
    this._labelType = ''
    this._labelTimer = 0
    this._isOpened = false
    messagePipeline.on('GAME_OPEN', this._gameOpen, this)
    messagePipeline.on('GAME_OVER', this._gameOver, this)
  },

  _gameOpen() {
    this._animation.play('LabelOpen')
    this._labelType = 'gameOpen'
    this._labelTimer = 3
  },

  _gameOver(event, detail) {
    this.gameData = event.detail
    this._animation.play('LabelOpen')
    this._labelType = 'gameOver'
  },


  _labelOpened() {
    this._isOpened = true
  },

  _labelClosed() {
    this._isOpened = false
  },

  update(dt) {
    if (!this._isOpened) {
      return
    }
    if (this._labelType === 'gameOpen') {
      this._labelTimer -= dt
      if (this._labelTimer > 0) {
        this.labelText.string = Math.ceil(this._labelTimer)
      } else if (this._labelTimer > -1) {
        this.labelText.string = 'START!'
      } else {
        this.labelText.string = ''
        this._labelType = ''
        this._animation.play('LabelClose')
        messagePipeline.sendMessage('GAME_START', this)
      }
    }
    if (this._labelType === 'gameOver') {
      let stageCount = this.gameData.stageCount
      this.labelText.string = `TIME UP!\nODEN:${stageCount - 1}`
    }
  }
});