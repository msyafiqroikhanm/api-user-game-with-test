const bcrypt = require("bcryptjs");
const request = require("supertest");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const app = require("../app");
const fs = require("fs");

beforeEach(async () => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("terlatihpatahhati", salt);
  const data1 = JSON.parse(
    fs.readFileSync("./seeders/data/user_game_biodata.json")
  );
  const userGameBiodata = data1.map((element) => {
    return {
      nickname: element.nickname,
      email: element.email,
      mobile_no: element.mobile_no,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("user_game_biodata", userGameBiodata);

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
});

describe("Authentication Test", () => {
  it("Success", (done) => {
    request(app)
      .post("/login")
      .send({
        username: "raptotor",
        password: "terlatihpatahhati",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("accessToken");
          done();
        }
      });
  });

  it("Error: Wrong Username", (done) => {
    request(app)
      .post("/login")
      .send({
        username: "rapthor98",
        password: "terlatihpatahhati",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("Invalid Username Or Password");
          done();
        }
      });
  });

  it("Error: Wrong Password", (done) => {
    request(app)
      .post("/login")
      .send({
        username: "raptotor",
        password: "sakithati",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(401);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("Invalid Username Or Password");
          done();
        }
      });
  });
});
