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
      fs.readFileSync("./seeders/data/user_game_biodata.json")
    );
    const userGameBiodata = data.map((element) => {
      return {
        nickname: element.nickname,
        email: element.email,
        mobile_no: element.mobile_no,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });
    await queryInterface.bulkInsert("user_game_biodata", userGameBiodata);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("user_game_biodata", null, {
      truncate: true,
      restartIdentity: true,
    });
  },
};
