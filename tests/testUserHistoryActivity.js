const { user_game, user_game_history, game_activity } = require("../models");

user_game
  .findOne({
    where: { id: "1" },
    include: [
      {
        model: user_game_history,
        as: "History",
        include: {
          model: game_activity,
          as: "Activity",
        },
      },
    ],
  })
  .then((data) => console.log(data))
  .catch((err) => console.log(err));
