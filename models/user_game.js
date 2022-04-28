"use strict";
const res = require("express/lib/response");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_game.belongsTo(models.user_game_biodata, {
        foreignKey: "user_game_biodata_id",
        as: "Biodata",
      });
      user_game.hasMany(models.user_game_history, {
        foreignKey: "user_game_id",
        as: "History",
      });
    }
  }
  user_game.init(
    {
      user_game_biodata_id: DataTypes.INTEGER,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_game",
    }
  );
  user_game.addHook("beforeCreate", (user) => {
    console.log(user.username);
  });
  return user_game;
};
