"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class game_activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      game_activity.hasMany(models.user_game_history, {
        foreignKey: "game_activity_id",
        as: "History",
      });
    }
  }
  game_activity.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "game_activity",
    }
  );
  return game_activity;
};
