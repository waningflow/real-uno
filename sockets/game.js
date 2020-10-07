class Game {
  constructor() {
    this.data = {};
    this.banker = null; // 游戏庄家
    this.players = []; // 游戏玩家
    this.steps = []; // 游戏完整的进程
  }

  start() {}
}

module.exports = Game;
