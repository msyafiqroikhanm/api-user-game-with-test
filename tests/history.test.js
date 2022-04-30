const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const fs = require("fs");

beforeEach(async () => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("terlatihpatahhati", salt);
  let data = JSON.parse(
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

  data = JSON.parse(fs.readFileSync("./seeders/data/user_games.json", "utf-8"));
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

  data = JSON.parse(
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

  data = JSON.parse(
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
});

afterEach(async () => {
  await queryInterface.bulkDelete("user_games", null, {
    truncate: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("user_game_biodata", null, {
    truncate: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("user_game_histories", null, {
    truncate: true,
    restartIdentity: true,
  });
  await queryInterface.bulkDelete("game_activities", null, {
    truncate: true,
    restartIdentity: true,
  });
});

let token = jwt.sign({ id: 1, username: "raptotor" }, "indonesiaraya", {
  expiresIn: "1h",
});

describe("History Test", () => {
  it("Success", (done) => {
    request(app)
      .get("/histories")
      .set("authorization", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(Array.isArray(res.body)).toBe(true);
          done();
        }
      });
  });

  it("Error: No Authorization Token", (done) => {
    request(app)
      .get("/histories")
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("Unauthorized Request");
          done();
        }
      });
  });

  it("Error: Invalid Authorization Token", (done) => {
    request(app)
      .get("/histories")
      .set("authorization", "token")
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("Unauthorized Request");
          done();
        }
      });
  });
});
