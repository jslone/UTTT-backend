/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var board = [];
for(var i = 0; i < 9; i++) {
  board.push([]);
  for(var j = 0; j < 9; j++) {
    board[i].push({t:''});
  }
  board[i].t = '';
}

module.exports = {

  attributes: {
    board: {
      type: 'array',
      defaultsTo: board
    },
    activeSub: {
      type: 'int',
      defaultsTo: -1
    },
    turn: {
      type: 'int',
      defaultsTo: 0
    },
    players: {
      type: 'array'
    }
  }
};
