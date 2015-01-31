/**
* Game.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var board = {d:[], t:''};
for(var i = 0; i < 9; i++) {
  board.d[i] = {d:[],t:''};
  for(var j = 0; j < 9; j++) {
    board.d[i].d[j] = {t:''};
  }
}

module.exports = {

  attributes: {
    board: {
      type: 'json',
      defaultsTo: board
    },
    activeSub: {
      type: 'integer',
      defaultsTo: -1
    },
    turn: {
      type: 'integer',
      defaultsTo: 0
    },
    players: {
      type: 'array'
    }
  }
};
