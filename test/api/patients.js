const request = require("supertest");
const db = require("../../db");
const app = require("../../app");

describe("POST /patients/create", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("responds with json", function(done) {
    request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Alex Beloshevsky",
        ownerPhoneNumber: "0506678419"
      })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});

describe("POST /patients/create", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("fails as expected when no owner name is provided", function(done) {
    request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerPhoneNumber: "0506678419"
      })
      .expect(400)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
});
