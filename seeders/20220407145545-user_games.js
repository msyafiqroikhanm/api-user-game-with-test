"use strict";
const fs = require("fs");
const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const data = JSON.parse(
      fs.readFileSync("./seeders/data/user_games.json", "utf-8")
    );
    const userGame = data.map((element) => {
      return {
        user_game_biodata_id: element.userGameBiodataId,
        username: element.username,
        password: bcrypt.hashSync(element.password),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("user_games", userGame);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("user_games", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
