import Goal from 'Goal'
import CountDown from 'CountDown'

import {
  messagePipeline
} from 'MessagePipeline'

const TANE_BASE = 3

cc.Class({
  extends: cc.Component,

  properties: {
    goal: Goal,
    countDown: CountDown,
    shukkaTimeAdd: cc.Animation,
    nextStageTimeAdd: cc.Animation,
    labelnextStageTime: cc.Label,
    labelOdn: cc.Label,
    labelStage: cc.Label,
    labelTime: cc.Label,
    timer: 20
  },

  // use this for initialization
  onLoad: function () {
    messagePipeline.on('STAGE_CLEAR', this._nextStage, this)
    messagePipeline.on('UNIT_SHUKKA', this._shukka, this)
    messagePipeline.on('GAME_START', this._gameStart, this)
    messagePipeline.on('GAME_RESET', this._gameReset, this)
  },

  init() {
    this.stageCount = 0
    this.taneCount = TANE_BASE

    this.openTimer = 0
    this.gameTimer = this.timer
    this.labelTime.string = `TIME:${Math.floor(this.gameTimer * 10) / 10}`

    this.targetOdnCount = 0
    this.gameStart = false
  },

  _nextStage() {
    if (this.stageCount > 0) {
      let addTime = Math.floor((this.stageCount - 1) / 3)
      if (addTime > 0) {
        this.labelnextStageTime.string = `+${addTime}sec`
        this.nextStageTimeAdd.play()
        this.gameTimer = Math.min(30, this.gameTimer + addTime)
      }
    }
    this.stageCount += 1
    this.taneCount = TANE_BASE + ((this.stageCount - 1) % TANE_BASE)

    this.targetOdnCount = 1 + Math.floor((this.stageCount - 1) / TANE_BASE)

    this.labelOdn.string = `ODEN:${this.stageCount - 1}`
    this.labelStage.string = `STAGE:${Math.floor((this.stageCount - 1) / TANE_BASE) + 1}-${(this.stageCount - 1) % TANE_BASE + 1}`

    messagePipeline.sendMessage('NEXT_STAGE', this)
  },

  _shukka() {
    this.targetOdnCount -= 1
    this.gameTimer = Math.min(30, this.gameTimer + 1)
    this.shukkaTimeAdd.play()
    // this.labelOdn.string = `ODN:${this.targetOdnCount}`
    this.labelOdn.string = `ODEN:${this.stageCount - 1}`
  },

  _gameStart() {
    this.gameStart = true
  },

  _gameReset() {
    this.init()
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
    if (this.openTimer < 1) {
      this.openTimer += dt
      if (this.openTimer >= 1) {
        messagePipeline.sendMessage('GAME_OPEN', this)
        this._nextStage()
      }
    }
    if (this.gameStart) {
      this.gameTimer = Math.max(0, this.gameTimer - dt)
      this.labelTime.string = `TIME:${Math.floor(this.gameTimer * 10) / 10}`

      this.countDown.countDown(this.gameTimer)
      if (this.gameTimer <= 0) {
        this.gameStart = false
        messagePipeline.sendMessage('GAME_OVER', this)
      }
    }
  }
});