const request = require("supertest");
const db = require("../../db");
const app = require("../../app");
const expect = require("chai").expect;

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

describe("GET /patients/all", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("returns an empty list of Patients", function() {
    return request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/)
      .then(docs => {
        expect(Array.isArray(docs.body)).to.be.equal(true);
        expect(docs.body.length).to.be.equal(0);
      });
  });

  it("returns a list of Patients with 1 patient", async function() {
    const ownerName = "Alex Beloshevsky";
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName,
        ownerPhoneNumber: "0506678419"
      });

    const docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(Array.isArray(docs.body)).to.be.equal(true);
    expect(docs.body.length).to.be.equal(1);
    expect(docs.body[0].ownerName).to.be.equal(ownerName);
  });
});
