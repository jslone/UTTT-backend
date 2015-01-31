/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var UTTT = require('../../frontend/app/scripts/game.coffee');

module.exports = {



  /**
   * `GameController.move()`
   */
  move: function (req, res) {
    var i = req.query.i;
    var j = req.query.j;
    var userID = req.query.userID;

    var game = new UTTT.Game(req.body);

    var player;
    if(userID == game.players[0].id) {
      player = game.players[0];
    } else if(userID == game.players[1].id) {
      player = game.players[1];
    } else {
      res.json(new Error('This is not your game!'));
      return;
    }

    if(game.canMove(i,j,player)) {
      game.move(i,j,player);

      Game.update(req.params.id,game)
      .then(function(newGame) {
        console.log(newGame);
        res.json(newGame[0] || null);
      })
      .catch(function(err) {
        console.log(err);
        res.json(err);
      });
    } else {
      res.json(new Error('Invalid move.'));
    }
  },


  /**
   * `GameController.findGames()`
   */
  findGames: function (req, res) {
    Game.native(function(err,collection) {
			if(err) {
				res.status(500);
				res.json(err);
			} else {
				collection.find({
					players: {
						$elemMatch: {
							id: req.params.id
						}
					}
				}).toArray(function(err,data) {
					if(err) {
						res.status(500);
						res.json(err);
					} else {
						res.json(data);
					}
				});
			}
		});
  }
};
