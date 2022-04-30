const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;
const bcrypt = require("bcryptjs");
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

let token = jwt.sign({ id: 1, username: "raptotor" }, "indonesiaraya", {
  expiresIn: "1h",
});

describe("GET All Users Test", () => {
  it("Success", (done) => {
    request(app)
      .get("/users")
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
      .get("/users")
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
      .get("/users")
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

describe("GET User By Id Test", () => {
  it("Success", (done) => {
    request(app)
      .get("/users/1")
      .set("authorization", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("username");
          expect(res.body).toHaveProperty("createdAt");
          expect(res.body).toHaveProperty("updatedAt");
          expect(res.body).toHaveProperty("Biodata");
          expect(res.body.Biodata).toHaveProperty("nickname");
          expect(res.body.Biodata).toHaveProperty("email");
          expect(res.body.Biodata).toHaveProperty("mobile_no");
          done();
        }
      });
  });

  it("Error: User Not Found", (done) => {
    request(app)
      .get("/users/10")
      .set("authorization", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("User Not Found!");
          done();
        }
      });
  });

  it("Error: No Authorization Token", (done) => {
    request(app)
      .get("/users/1")
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
      .get("/users/1")
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

describe("POST Users Test", () => {
  it("Success", (done) => {
    request(app)
      .post("/users")
      .set("authorization", token)
      .send({
        email: "roikhaan@mail.com",
        username: "roikhaan",
        mobile_no: "081281238907",
        password: "roikhaan",
        nickname: "myroikha",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(201);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("User Has Been Created");
          done();
        }
      });
  });

  it("Error: Bad Request (Invalid mobile_no)", (done) => {
    request(app)
      .post("/users")
      .set("authorization", token)
      .send({
        email: "roikhan@mail.com",
        username: "roikhan",
        mobile_no: "981281238907",
        password: "roikhan",
        nickname: "myroikh",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toHaveProperty("errors");
          expect(Array.isArray(res.body.message.errors)).toBe(true);
          expect(res.body.message.errors.length).toBe(1);
          done();
        }
      });
  });

  it("Error: Bad Request (Invalid mobile_no & No email)", (done) => {
    request(app)
      .post("/users")
      .set("authorization", token)
      .send({
        username: "roikhan",
        mobile_no: "981281238907",
        password: "roikhan",
        nickname: "myroikh",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toHaveProperty("errors");
          expect(Array.isArray(res.body.message.errors)).toBe(true);
          expect(res.body.message.errors.length).toBe(2);
          done();
        }
      });
  });

  it("Error: Bad Request (email or username is exist)", (done) => {
    request(app)
      .post("/users")
      .set("authorization", token)
      .send({
        email: "palingberguna@mail.com",
        username: "botcat",
        mobile_no: "081281238907",
        password: "roikhan",
        nickname: "myroikh",
      })
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(400);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("Bad Request");
          done();
        }
      });
  });

  it("Error: No Authorization Token", (done) => {
    request(app)
      .post("/users")
      .send({
        email: "roikhan@mail.com",
        username: "roikhan",
        mobile_no: "081281238907",
        password: "roikhan",
        nickname: "myroikh",
      })
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
      .post("/users")
      .set("authorization", "token")
      .send({
        email: "roikhan@mail.com",
        username: "roikhan",
        mobile_no: "081281238907",
        password: "roikhan",
        nickname: "myroikh",
      })
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

describe("DELETE User Test", () => {
  it("Success", (done) => {
    request(app)
      .delete("/users/1")
      .set("authorization", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("User Has Been Deleted");
          done();
        }
      });
  });

  it("Error: Not Found", (done) => {
    request(app)
      .delete("/users/10")
      .set("authorization", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(404);
          expect(res.body).toHaveProperty("message");
          expect(res.body.message).toBe("User Not Found!");
          done();
        }
      });
  });

  it("Error: No Authorization Token", (done) => {
    request(app)
      .delete("/users/1")
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
      .delete("/users/1")
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
