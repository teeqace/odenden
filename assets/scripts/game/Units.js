import {
  messagePipeline
} from 'MessagePipeline'

const UNIT_MAX_COUNT = 3
const UNIT_HEIGHT = 70

cc.Class({
  extends: cc.Component,

  properties: {
    unitPrefab: cc.Prefab
  },

  // use this for initialization
  onLoad: function () {
    messagePipeline.on('NEXT_STAGE', this._nextStage, this)
    messagePipeline.on('TANE_SWAP', this._taneSwap, this)
    messagePipeline.on('GAME_RESET', this._gameReset, this)
    this.taneCount = 0
    this.targetOdnCount = 0
    this.restOdnCount = 0
    // this.units = []
    // for (let i = 0; i < UNIT_COUNT; i++) {
    //   let instance = cc.instantiate(this.unitPrefab)
    //   instance.parent = this.node
    //   instance.y = UNIT_HEIGHT * (UNIT_COUNT + 1)
    //   instance.on('shukka', this._shukka, this)

    //   let unit = instance.getComponent('Unit')
    //   units.stack(i, taneCount)
    //   // this.units.push(unit)
    // }
  },

  _nextStage(event, detail) {
    let game = event.getUserData()
    this.taneCount = game.taneCount
    this.targetOdnCount = game.targetOdnCount
    // for (let i = 0; i < this.units.length; i++) {
    //   this.units[i].node.y = UNIT_HEIGHT * (UNIT_COUNT + 1)
    //   this.units[i].stack(i, taneCount)
    // }
    let createCount = Math.min(UNIT_MAX_COUNT, this.targetOdnCount)
    for (let i = 0; i < createCount; i++) {
      this.newUnit(i + 1)
      // this.units.push(unit)
    }
    this.restOdnCount = Math.max(0, this.targetOdnCount - createCount)
  },

  _shukka() {
    this.node.getComponentsInChildren('Unit').forEach((unit) => {
      unit.fall()
    }, this)

    let fieldCount = this.node.children.length

    messagePipeline.sendMessage('UNIT_SHUKKA', this)
    if (this.restOdnCount > 0 && fieldCount <= UNIT_MAX_COUNT) {
      this.newUnit(fieldCount)
      this.restOdnCount -= 1
    } else if (this.restOdnCount === 0 && fieldCount <= 1) {
      messagePipeline.sendMessage('STAGE_CLEAR', this)
    }
  },

  _taneSwap(event, detail) {
    let swapIndex = event.getUserData()
    this.node.getComponentsInChildren('Unit').forEach((unit) => {
      if (unit.unitIndex === 0) {
        unit.swap(swapIndex)
      }
    }, this)
  },

  _gameReset(event, detail) {
    this.node.removeAllChildren()
  },

  newUnit(index) {
    let instance = cc.instantiate(this.unitPrefab)
    instance.parent = this.node
    instance.y = UNIT_HEIGHT * (UNIT_MAX_COUNT + 1)
    instance.on('shukka', this._shukka, this)

    let unit = instance.getComponent('Unit')
    unit.stack(index, this.taneCount)
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {}
});