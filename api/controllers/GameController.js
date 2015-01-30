/**
 * GameController
 *
 * @description :: Server-side logic for managing Games
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {



  /**
   * `GameController.move()`
   */
  move: function (req, res) {
    return res.json({
      todo: 'move() is not implemented yet!'
    });
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
							id: parseInt(req.params.id)
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
