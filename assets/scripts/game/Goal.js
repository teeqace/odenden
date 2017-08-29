import {
  messagePipeline
} from 'MessagePipeline'

const TANE_WIDTH = 128

cc.Class({
  extends: cc.Component,

  properties: {
    tanes: {
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
    let right = (TANE_WIDTH / 2) * (taneCount - 1)
    for (let i = 0; i < taneCount; i++) {
      this.tanes[i].x = right - (TANE_WIDTH * i)
    }
    for (let i = taneCount; i < this.tanes.length; i++) {
      this.tanes[i].x = 1000
    }
  }

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
});