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
      fs.readFileSync("./seeders/data/game_activity.json", "utf-8")
    );
    const gameActivities = data.map((element) => {
      return {
        name: element.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("game_activities", gameActivities);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("game_activities", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
