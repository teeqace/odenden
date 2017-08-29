import {
  messagePipeline
} from 'MessagePipeline'

cc.Class({
  extends: cc.Component,

  properties: {},

  // use this for initialization
  onLoad: function () {},

  // called every frame, uncomment this function to activate update callback
  // update: function (dt) {

  // },
  $swap(event, detail) {
    let swapIndex = Number(detail)
    messagePipeline.sendMessage('TANE_SWAP', swapIndex)
  }
});