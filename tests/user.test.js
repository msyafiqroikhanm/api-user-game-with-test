const request = require("supertest");
const app = require("../app");
const jwt = require("jsonwebtoken");

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

  it("Error: No Authentication Token", (done) => {
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

  it("Error: Invalid Authentication Token", (done) => {
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
      .get("/users/" + 1)
      .set("authentication", token)
      .end((err, res) => {
        if (err) {
          done(err);
        } else {
          expect(res.status).toBe(200);
          done();
        }
      });
  });
});
