const { user_game, user_game_biodata } = require("../models");
user_game_biodata
  .findOne({
    where: { id: 1 },
    include: { model: user_game, as: "User" },
  })
  .then((user) => console.log(user))
  .catch((err) => console.log(err));

// user_game.findOne({
//   where: { id: 1 },
//   include: { model: user_game_biodata, as: "Biodata" },
// })
//   .then((user) => console.log(user))
//   .catch((err) => console.log(err));
