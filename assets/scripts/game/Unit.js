// const UNIT_HEIGHT = 96
// const UNIT_Y = [
//   0, 96, 128
// ]
const TANE_WIDTH = 128
const CORRECT_TANE = [
  'kon', 'dai', 'chiku', 'naru', 'han'
]

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
    this.animation = this.node.getComponent(cc.Animation)
    // this.fallSpeed = 2000
    this.stacked = false
    this.unitIndex = 0
    // this.timeLag = 0
    // this.unitY = UNIT_HEIGHT * this.unitIndex
    this.taneCount = 0

    this.isOnSwapping = false
    this.isOnShukkaing = false

    this.moveToRight = cc.moveBy(0.1, TANE_WIDTH, 0)
    this.moveToLeft = cc.sequence(cc.moveBy(0.1, -TANE_WIDTH, 0), cc.callFunc(function () {
      this.isOnSwapping = false
      this.unitCheck()
    }, this))
  },

  stack(index, taneCount) {
    this.stacked = true
    this.unitIndex = index
    // this.timeLag = 0.1 * this.unitIndex
    // this.fallSpeed = 2000
    // this.unitY = UNIT_HEIGHT * this.unitIndex
    this.taneCount = taneCount

    // this.node.setScale(0.1)
    // this.node.opacity = 0

    for (let i = 0; i < this.tanes.length; i++) {
      if (CORRECT_TANE.indexOf(this.tanes[i].name) < this.taneCount) {
        this.tanes[i].active = true
      } else {
        this.tanes[i].active = false
      }
    }
    this.shuffle()
    while (this.isCorrect()) {
      this.shuffle()
    }

    let right = (TANE_WIDTH / 2) * (this.taneCount - 1)
    for (let i = 0; i < this.tanes.length; i++) {
      if (this.tanes[i].active) {
        this.tanes[i].x = right - (TANE_WIDTH * this.tanes[i].lane)
      }
    }
    this.fall()
  },

  fall() {
    this.unitIndex = Math.max(0, this.unitIndex - 1)
    this.animation.play('fall' + this.unitIndex)
    // this.timeLag = 0.05 * this.unitIndex
    // this.fallSpeed = 1000
    // this.unitY = UNIT_HEIGHT * this.unitIndex

    // let fade = cc.fadeTo(0.1, 255 - (this.unitIndex * 50))
    // let fall = cc.moveTo(0.1, 0, UNIT_Y[this.unitIndex])
    // let scale = cc.scaleTo(0.1, 1.0 - (this.unitIndex * 0.3))
    // let action = cc.spawn(fade, fall, scale)
    // this.node.runAction(action)
  },

  shuffle() {
    var n = this.tanes.length,
      t, i;

    while (n) {
      i = Math.floor(Math.random() * n--);
      t = this.tanes[n];
      this.tanes[n] = this.tanes[i];
      this.tanes[i] = t;
    }
    this.resetLane()
  },

  isCorrect() {
    for (let i = 0; i < this.tanes.length; i++) {
      if (this.tanes[i].active) {
        if (this.tanes[i].lane !== CORRECT_TANE.indexOf(this.tanes[i].name)) {
          return false
        }
      }
    }
    return true
  },

  resetLane() {
    let lane = 0
    for (let i = 0; i < this.tanes.length; i++) {
      if (this.tanes[i].active) {
        this.tanes[i].lane = lane
        lane += 1
      } else {
        this.tanes[i].lane = -1
      }
    }
  },

  unitCheck() {
    if (this.isCorrect()) {
      this.isOnShukkaing = true
      this.animation.play('shukka' + this.taneCount)
    }
  },

  shukka() {
    this.node.emit('shukka', this)
    this.node.destroy()
  },

  swap(swapIndex) {
    if (this.isOnSwapping || this.isOnShukkaing) {
      return
    }
    this.isOnSwapping = true
    let left = this.getTaneByLane(swapIndex)
    let right = this.getTaneByLane(swapIndex - 1)
    left.lane -= 1
    right.lane += 1
    left.runAction(this.moveToRight)
    right.runAction(this.moveToLeft)
  },

  getTaneByLane(lane) {
    for (let i = 0; i < this.tanes.length; i++) {
      if (this.tanes[i].lane === lane) {
        return this.tanes[i]
      }
    }
    return null
  },

  // called every frame, uncomment this function to activate update callback
  update: function (dt) {
    if (!this.stacked) {
      return
    }
    // if (this.timeLag > 0) {
    //   this.timeLag -= dt
    //   return
    // }
    this.node.zIndex = 100 - this.unitIndex
    // if (this.unitY < this.node.y && this.node.y - this.unitY > dt * this.fallSpeed) {
    //   this.node.y -= dt * this.fallSpeed
    //   this.node.zIndex = 100 - this.unitIndex
    // } else {
    //   this.node.y = this.unitY
    //   this.node.zIndex = 100 - this.unitIndex
    // }
  }
});