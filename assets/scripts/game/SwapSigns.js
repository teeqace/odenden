import {
  messagePipeline
} from 'MessagePipeline'

const SIGN_DISTANCE = 128

cc.Class({
  extends: cc.Component,

  properties: {
    signs: {
      default: [],
      type: [cc.Node]
    }
  },

  // use this for initialization
  onLoad: function () {
    messagePipeline.on('NEXT_STAGE', this._nextStage, this)
  },

  _nextStage(event, detail) {
    let game = event.getUserData()
    let taneCount = game.taneCount
    let signCount = taneCount - 1

    let signRight = (SIGN_DISTANCE / 2) * (signCount - 1)
    for (let i = 0; i < this.signs.length; i++) {
      if (i < signCount) {
        this.signs[i].x = signRight - (SIGN_DISTANCE * i)
      } else {
        this.signs[i].x = 1000
      }
    }
  }
});