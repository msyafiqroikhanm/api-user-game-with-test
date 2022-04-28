const {
  user_game,
  user_game_biodata,
  user_game_history,
  game_activity,
} = require("../models");

const checkHistoryUser = async (userId) => {
  const count = await user_game_history.count({ id: userId });
  return count;
};

const deleteHistory = async (user_game_id) => {
  if (checkHistoryUser) {
    return await user_game_history.destroy({
      where: {
        user_game_id,
      },
    });
  } else {
    return true;
  }
};

const findAllHistories = async () => {
  return await user_game_history.findAll({
    attributes: ["id", "createdAt"],
    include: [
      {
        model: user_game,
        as: "User",
        attributes: ["username"],
      },
      {
        model: game_activity,
        as: "Activity",
        attributes: ["name"],
      },
    ],
  });
};

module.exports = { deleteHistory, findAllHistories };
