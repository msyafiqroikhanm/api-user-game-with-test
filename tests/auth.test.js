const request = require("supertest");
const bcrypt = require("bcryptjs");
const app = require("../app");
const { sequelize } = require("../models");
const { queryInterface } = sequelize;

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

  it("Wrong Username", (done) => {
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

  it("Wrong Password", (done) => {
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
