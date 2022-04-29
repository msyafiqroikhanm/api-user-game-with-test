const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

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
