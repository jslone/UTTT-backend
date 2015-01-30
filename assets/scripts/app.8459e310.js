(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
  * @ngdoc overview
  * @name utttApp
  * @description
  * # utttApp
  *
  * Main module of the application.
 */
var app;

angular.module('utttApp', ['ngAnimate', 'ngCookies', 'ngResource', 'ngRoute', 'ngSanitize', 'ngTouch', 'facebook']).config([
  '$routeProvider', function($routeProvider) {
    return $routeProvider.when('/', {
      templateUrl: 'views/main.html'
    }).when('/game/:id', {
      templateUrl: 'views/board.html',
      controller: 'GameCtrl'
    }).when('/games', {
      templateUrl: 'views/games.html',
      controller: 'GamesCtrl'
    }).otherwise({
      redirectTo: '/'
    });
  }
]).config([
  'FacebookProvider', function(FacebookProvider) {
    return FacebookProvider.init('1046434812049317');
  }
]);

app = angular.module('utttApp');

require('./controllers/games.coffee').init(app);

require('./controllers/game.coffee').init(app);

require('./directives/subboard.coffee').init(app);



},{"./controllers/game.coffee":2,"./controllers/games.coffee":3,"./directives/subboard.coffee":4}],2:[function(require,module,exports){
var UTTT, Utils;

UTTT = require('../game.coffee');

Utils = require('../utils.coffee');

module.exports = {
  init: function(module) {

    /**
      * @ngdoc function
      * @name utttApp.controller:GameofflineCtrl
      * @description
      * # GameofflineCtrl
      * Controller of the utttApp
     */
    return module.controller('GameCtrl', [
      '$scope', '$routeParams', '$resource', function($scope, $routeParams, $resource) {
        var Games, moveFn, worker;
        $scope.move = function(i, j) {
          if ($scope.game.move(i, j, $scope.player)) {
            return $scope.endTurn(i, j);
          }
        };
        if ($routeParams.id <= 2) {
          $scope.game = new UTTT.Game();
          $scope.player = $scope.game.players[0];
          if ($routeParams.id === '1') {
            worker = new Worker('/scripts/parai.js');
            worker.addEventListener('message', function(e) {
              var i, j, _ref;
              _ref = e.data.move, i = _ref.i, j = _ref.j;
              $scope.game.move(i, j, $scope.game.players[1]);
              return $scope.$digest();
            });
            $scope.endTurn = function() {
              return worker.postMessage({
                game: $scope.game
              });
            };
          }
          if ($routeParams.id === '2') {
            return $scope.endTurn = function() {
              return $scope.player = $scope.game.players[$scope.game.turn];
            };
          }
        } else {
          Games = $resource('/game/:id', {}, {
            move: {
              method: 'POST'
            }
          });
          moveFn = $scope.move;
          $scope.move = function() {};
          Games.get({
            id: $routeParams.id
          }, function(game) {
            $scope.game = new Game(game);
            $scope.move = moveFn;
            return $scope.endTurn = function(i, j) {
              return game.$move({
                i: i,
                j: j
              });
            };
          });
          return $scope.player = $scope.game.players[0];
        }
      }
    ]);
  }
};



},{"../game.coffee":5,"../utils.coffee":7}],3:[function(require,module,exports){
module.exports = {
  init: function(module) {

    /**
      * @ngdoc function
      * @name utttApp.controller:AuthCtrl
      * @description
      * # AuthCtrl
      * Controller of the utttApp
     */
    return module.controller('GamesCtrl', [
      '$scope', 'Facebook', function($scope, Facebook) {
        $scope.login = function() {
          return Facebook.login(function(res) {
            return console.log(res);
          }, {
            scope: 'user_friends,apprequests'
          });
        };
        $scope.getLoginStatus = function() {
          return Facebook.getLoginStatus(function(res) {
            if (res.status === 'connected') {
              $scope.userID = res.authResponse.userID;
              $scope.me();
              return $scope.getFriends();
            } else {
              return $scope.login();
            }
          });
        };
        $scope.me = function() {
          return Facebook.api('/me', function(res) {
            return $scope.user = res;
          });
        };
        $scope.getFriends = function() {
          return Facebook.api('/me/friends', function(res) {
            console.log(res);
            return $scope.friends = res.data;
          });
        };
        $scope.inviteFriends = function() {
          return Facebook.ui({
            method: 'apprequests',
            message: 'Lets play a game of Ultimate Tic Tac Toe!'
          });
        };
        return $scope.getLoginStatus();
      }
    ]);
  }
};



},{}],4:[function(require,module,exports){
module.exports = {
  init: function(module) {

    /**
      * @ngdoc directive
      * @name utttApp.directive:subboard
      * @description
      * # subboard
     */
    return module.directive('subboard', function() {
      return {
        templateUrl: 'views/subboard.html',
        restrict: 'ACE',
        scope: {
          move: '&',
          board: '='
        }
      };
    });
  }
};



},{}],5:[function(require,module,exports){
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
      this.board = Utils.add((function() {
        var _i, _results;
        _results = [];
        for (i = _i = 1; _i <= 9; i = ++_i) {
          _results.push(Utils.add((function() {
            var _j, _results1;
            _results1 = [];
            for (i = _j = 1; _j <= 9; i = ++_j) {
              _results1.push({
                t: ''
              });
            }
            return _results1;
          })(), {
            t: ''
          }));
        }
        return _results;
      })(), {
        t: ''
      });
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
      this.board = Utils.add((function() {
        var _i, _len, _ref, _results;
        _ref = options.board;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          sub = _ref[_i];
          _results.push(Utils.add((function() {
            var _j, _len1, _results1;
            _results1 = [];
            for (_j = 0, _len1 = sub.length; _j < _len1; _j++) {
              i = sub[_j];
              _results1.push({
                t: i.t
              });
            }
            return _results1;
          })(), {
            t: sub.t
          }));
        }
        return _results;
      })(), {
        t: options.board.t
      });
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
      if (board[i].t !== '' && board[i].t !== 'C') {
        if (board[i].t === board[j].t && board[i].t === board[k].t) {
          return board[i].t;
        }
      }
    }
    for (i = _j = 0; _j < 9; i = _j += 1) {
      if (board[i].t === '') {
        return '';
      }
    }
    return 'C';
  };

  Game.prototype.canMove = function(i, j, player) {
    return player.id === this.players[this.turn].id && (i === this.activeSub || this.activeSub < 0) && this.board[i][j].t === '' && this.board.t === '';
  };

  Game.prototype.move = function(i, j, player) {
    if (player == null) {
      player = this.players[this.turn];
    }
    if (this.canMove(i, j, player)) {
      this.board[i][j].t = player.t;
      this.board[i].t = this.findWinner(this.board[i]);
      this.activeSub = this.board[j].t === '' ? j : -1;
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
    } else if (Array.isArray(board)) {
      Pws = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = board.length; _i < _len; _i++) {
          sub = board[_i];
          _results.push(this.rateBoard(sub, t));
        }
        return _results;
      }).call(this);
      Pls = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = board.length; _i < _len; _i++) {
          sub = board[_i];
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
    return this.board[i][j].t === '';
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



},{"./negamax.coffee":6,"./utils.coffee":7}],6:[function(require,module,exports){
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



},{}],7:[function(require,module,exports){
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



},{}]},{},[1]);
