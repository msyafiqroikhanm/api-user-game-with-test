"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game_history extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_game_history.belongsTo(models.game_activity, {
        foreignKey: "game_activity_id",
        as: "Activity",
      });
      user_game_history.belongsTo(models.user_game, {
        foreignKey: "user_game_id",
        as: "User",
      });
    }
  }
  user_game_history.init(
    {
      user_game_id: DataTypes.INTEGER,
      game_activity_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "user_game_history",
    }
  );
  return user_game_history;
};
