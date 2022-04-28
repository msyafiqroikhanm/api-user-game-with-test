"use strict";
const fs = require("fs");

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
      fs.readFileSync("./seeders/data/user_game_history.json", "utf-8")
    );
    const userGameHistory = data.map((element) => {
      return {
        user_game_id: element.userGameId,
        game_activity_id: element.gameActivityId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("user_game_histories", userGameHistory);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("user_game_histories", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
