"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user_game_biodata extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user_game_biodata.hasOne(models.user_game, {
        foreignKey: "user_game_biodata_id",
        as: "User",
      });
    }
  }
  user_game_biodata.init(
    {
      nickname: DataTypes.STRING,
      email: DataTypes.STRING,
      mobile_no: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "user_game_biodata",
    }
  );
  return user_game_biodata;
};
