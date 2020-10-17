// deal card

const { cards, cardIds } = require('./cards');
const { randomArr } = require('../utils/_');

const AT = {
  DealCard: 'DealCard',
  ShuffleCard: 'ShuffleCard',
  CutCard: 'CutCard',
};

class Game {
  constructor({ io, roomId, roomData }) {
    this.init({ io, roomId, roomData });
  }

  init({ io, roomId, roomData }) {
    this.io = io;
    this.roomId = roomId;
    this.players = roomData.users; // 游戏玩家
    this.playersCount = this.players.length; // 游戏玩家数量
    this.bankerIndex = Math.floor(Math.random() * this.playersCount); // 游戏庄家序号
    this.banker = this.players[this.bankerIndex]; // 游戏庄家
    this.cardSource = cards; // 游戏完整牌库
    this.cardIds = randomArr(cardIds); // 初始洗牌后的牌库
    this.steps = []; // 游戏完整的进程
    this.getNext = (i) => {
      return (i + 1) % this.playersCount;
    };
  }

  forfrom(cb) {
    let startIndex = this.bankerIndex;
    for (let j = 0; j < this.playersCount; j++) {
      cb(this.players[startIndex], startIndex, j);
      startIndex = this.getNext(startIndex);
    }
  }

  start() {
    const firstCount = 7;
    this.forfrom((player, index) => {
      player.currentCards = this.cardIds.splice(0, firstCount);
    });
    for (let i = 0; i < this.playersCount; i++) {
      let step = {
        from: 'god',
        to: this.players[i],
        actions: [],
      };
      this.forfrom((player, index) => {
        let isSelf = index === i;
        step.actions.push({
          type: AT.DealCard,
          value: {
            count: firstCount,
            ids: isSelf ? player.currentCards : [],
            to: this.players[index],
          },
        });
      });
      this.steps.push(step);
    }
    console.log(this.steps);
  }
}

module.exports = Game;
