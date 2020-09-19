const { cards } = require('cards');

console.log(cards);

class Uno {
  constructor() {
    this.cards = [];
  }
}

module.exports = new Uno();
