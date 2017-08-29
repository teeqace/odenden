import {
  messagePipeline
} from 'MessagePipeline'

const AREA_WIDTH = 600

cc.Class({
  extends: cc.Component,

  properties: {
    buttons: {
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
    let buttonCount = taneCount - 1

    let buttonWidth = AREA_WIDTH / buttonCount
    let buttonRight = (buttonWidth / 2) * (buttonCount - 1)
    for (let i = 0; i < this.buttons.length; i++) {
      if (i < buttonCount) {
        this.buttons[i].width = buttonWidth
      } else {
        this.buttons[i].width = 0
      }
      this.buttons[i].x = buttonRight - (buttonWidth * i)
    }
  }
});