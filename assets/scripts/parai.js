(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var AI, Game, GameNode, Utils;

AI = require('./negamax.coffee');

Utils = require('./utils.coffee');

Game = (function() {
  Game.prototype.wins = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

  Game.prototype.calculateProb = function(Ps, d) {
    var P, Pmask, color, i, mask, sum, winMasks, _i, _j, _k, _ref, _ref1;
    if (d == null) {
      d = false;
    }
    P = 0;
    winMasks = 1 << this.wins.length;
    for (mask = _i = 1; _i < winMasks; mask = _i += 1) {
      color = 2 * (Utils.bitParity8(mask)) - 1;
      Pmask = 0;
      for (i = _j = 0, _ref = this.wins.length; _j < _ref; i = _j += 1) {
        if (mask & (1 << i)) {
          Pmask |= (1 << this.wins[i][0]) | (1 << this.wins[i][1]) | (1 << this.wins[i][2]);
        }
      }
      sum = 1;
      for (i = _k = 0, _ref1 = Ps.length; 0 <= _ref1 ? _k < _ref1 : _k > _ref1; i = 0 <= _ref1 ? ++_k : --_k) {
        if (Pmask & (1 << i)) {
          sum *= Ps[i];
        }
      }
      P += color * sum;
    }
    return P;
  };

  function Game(options) {
    var i, sub;
    if (options == null) {
      options = null;
    }
    if (options === null) {
      this.board = {
        t: '',
        d: (function() {
          var _i, _results;
          _results = [];
          for (i = _i = 1; _i <= 9; i = ++_i) {
            _results.push({
              t: '',
              d: (function() {
                var _j, _results1;
                _results1 = [];
                for (i = _j = 1; _j <= 9; i = ++_j) {
                  _results1.push({
                    t: ''
                  });
                }
                return _results1;
              })()
            });
          }
          return _results;
        })()
      };
      this.activeSub = -1;
      this.turn = 0;
      this.players = [
        {
          id: 0,
          t: 'X',
          name: 'X'
        }, {
          id: 1,
          t: 'O',
          name: 'O'
        }
      ];
    } else {
      this.board = {
        t: options.board.t,
        d: (function() {
          var _i, _len, _ref, _results;
          _ref = options.board.d;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            sub = _ref[_i];
            _results.push({
              t: sub.t,
              d: (function() {
                var _j, _len1, _ref1, _results1;
                _ref1 = sub.d;
                _results1 = [];
                for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
                  i = _ref1[_j];
                  _results1.push({
                    t: i.t
                  });
                }
                return _results1;
              })()
            });
          }
          return _results;
        })()
      };
      this.activeSub = options.activeSub;
      this.turn = options.turn;
      this.players = options.players;
    }
  }

  Game.prototype.findWinner = function(board) {
    var i, j, k, win, _i, _j, _len, _ref;
    _ref = this.wins;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      win = _ref[_i];
      i = win[0], j = win[1], k = win[2];
      if (board.d[i].t !== '' && board.d[i].t !== 'C') {
        if (board.d[i].t === board.d[j].t && board.d[i].t === board.d[k].t) {
          return board.d[i].t;
        }
      }
    }
    for (i = _j = 0; _j < 9; i = _j += 1) {
      if (board.d[i].t === '') {
        return '';
      }
    }
    return 'C';
  };

  Game.prototype.canMove = function(i, j, player) {
    return player.id === this.players[this.turn].id && (i === this.activeSub || this.activeSub < 0) && this.board.d[i].d[j].t === '' && this.board.t === '';
  };

  Game.prototype.move = function(i, j, player) {
    if (player == null) {
      player = this.players[this.turn];
    }
    if (this.canMove(i, j, player)) {
      this.board.d[i].d[j].t = player.t;
      this.board.d[i].t = this.findWinner(this.board.d[i]);
      this.activeSub = this.board.d[j].t === '' ? j : -1;
      this.board.t = this.findWinner(this.board);
      this.turn = (this.turn + 1) % this.players.length;
      return true;
    }
    return false;
  };

  Game.prototype.rateBoard = function(board, t, d) {
    var Pl, Pls, Pw, Pws, other, sub;
    if (d == null) {
      d = false;
    }
    other = t === 'X' ? 'O' : 'X';
    if (board.t === t) {
      return 1;
    } else if (board.t === other) {
      return 0;
    } else if (board.d != null) {
      Pws = (function() {
        var _i, _len, _ref, _results;
        _ref = board.d;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          _results.push(this.rateBoard(sub, t));
        }
        return _results;
      }).call(this);
      Pls = (function() {
        var _i, _len, _ref, _results;
        _ref = board.d;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          _results.push(this.rateBoard(sub, other));
        }
        return _results;
      }).call(this);
      Pw = this.calculateProb(Pws);
      Pl = this.calculateProb(Pls);
      if (d) {
        console.log(Pws);
        console.log(Pw, Pl);
      }
      return Math.sqrt(Pw) * Math.sqrt(1 - Pl);
    } else {
      return 0.5;
    }
  };

  Game.prototype.value = function() {
    return this.rateBoard(this.board, 'X');
  };

  Game.prototype.open = function(_arg) {
    var i, j;
    i = _arg.i, j = _arg.j;
    return this.board.d[i].d[j].t === '';
  };

  Game.prototype.filterOpen = function(moves) {
    return moves.filter(this.open.bind(this));
  };

  Game.prototype.findMoves = function() {
    var i, j;
    if (this.activeSub < 0) {
      return this.filterOpen(Utils.flatten((function() {
        var _i, _results;
        _results = [];
        for (j = _i = 0; _i <= 8; j = ++_i) {
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (i = _j = 0; _j <= 8; i = ++_j) {
              _results1.push({
                i: i,
                j: j
              });
            }
            return _results1;
          })());
        }
        return _results;
      })()));
    } else {
      return this.filterOpen((function() {
        var _i, _results;
        _results = [];
        for (j = _i = 0; _i <= 8; j = ++_i) {
          _results.push({
            i: this.activeSub,
            j: j
          });
        }
        return _results;
      }).call(this));
    }
  };

  Game.prototype.bestMove = function() {
    var color, node;
    color = -2 * this.turn + 1;
    node = new GameNode(this);
    AI.negamax(node, 10000, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, color);
    return node.bestDelta;
  };

  return Game;

})();

GameNode = (function() {
  function GameNode(game, move) {
    this.game = game;
    if (move == null) {
      move = null;
    }
    if (move != null) {
      this.game.move(move.i, move.j);
      this.delta = move;
    }
  }

  GameNode.prototype.isTerminal = function() {
    return this.game.board.t !== '';
  };

  GameNode.prototype.getChildren = function() {
    var move, _i, _len, _ref, _results;
    _ref = this.game.findMoves();
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      move = _ref[_i];
      _results.push(new GameNode(new Game(this.game), move));
    }
    return _results;
  };

  GameNode.prototype.value = function() {
    return this.game.value();
  };

  GameNode.prototype.applyDelta = function() {
    return this.game.move(this.bestDelta);
  };

  return GameNode;

})();

module.exports = {
  Game: Game
};



},{"./negamax.coffee":2,"./utils.coffee":4}],2:[function(require,module,exports){
var Node, negamax;

negamax = function(node, depth, a, b, color) {
  var child, children, _i, _len, _ref, _results;
  if (depth <= 1 || node.isTerminal()) {
    node.v = color * node.value();
    return;
  }
  node.v = Number.NEGATIVE_INFINITY;
  children = node.getChildren();
  _ref = node.getChildren();
  _results = [];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    child = _ref[_i];
    negamax(child, depth / children.length - 1, -b, -a, -color);
    child.v = -child.v;
    if (child.v > node.v) {
      node.v = child.v;
      node.bestDelta = child.delta;
    }
    a = Math.max(a, child.v);
    if (a >= b) {
      break;
    } else {
      _results.push(void 0);
    }
  }
  return _results;
};

Node = (function() {
  function Node() {}

  Node.prototype.isTerminal = function() {
    return true;
  };

  Node.prototype.getChildren = function() {
    return [];
  };

  Node.prototype.value = function() {
    return 0;
  };

  Node.prototype.applyDelta = function() {};

  return Node;

})();

module.exports = {
  negamax: negamax
};



},{}],3:[function(require,module,exports){
var UTTT, Utils;

UTTT = require('./game.coffee');

Utils = require('./utils.coffee');

self.addEventListener('message', function(e) {
  var game, move;
  game = new UTTT.Game(e.data.game);
  move = game.bestMove();
  return self.postMessage({
    move: move
  });
});



},{"./game.coffee":1,"./utils.coffee":4}],4:[function(require,module,exports){
module.exports = {
  add: function(obj1, obj2) {
    var k;
    for (k in obj2) {
      obj1[k] = obj2[k];
    }
    return obj1;
  },
  flatten: function(array) {
    return array.reduce(function(a, b) {
      return a.concat(b, []);
    });
  },
  bitParity8: function(v) {
    v ^= v >> 16;
    v ^= v >> 8;
    v ^= v >> 4;
    v &= 0xf;
    return (0x6996 >> v) & 1;
  }
};



},{}]},{},[3]);
