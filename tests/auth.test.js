const request = require("supertest");
const app = require("../app");

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
