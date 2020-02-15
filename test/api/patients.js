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
      .expect("Content-Type", /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
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

describe("PUT /patients/:id", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("returns a changed value after changing existing patient", async function() {
    const ownerName = "Alex Beloshevsky";
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Testy McTestface",
        ownerPhoneNumber: "0506678419"
      });

    let docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .put("/patients/" + docs.body[0]._id)
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName,
        ownerPhoneNumber: "0506678419"
      })
      .expect(200)
      .expect("Content-Type", /json/);

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(Array.isArray(docs.body)).to.be.equal(true);
    expect(docs.body.length).to.be.equal(1);
    expect(docs.body[0].ownerName).to.be.equal(ownerName);
  });
});

describe("DELETE /patients/:id", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("returns an empty DB after inserting one patient and deleting it", async function() {
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Alex Beloshevsky",
        ownerPhoneNumber: "0506678419"
      });

    let docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .delete("/patients/" + docs.body[0]._id)
      .expect(200)
      .expect("Content-Type", /json/);

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(Array.isArray(docs.body)).to.be.equal(true);
    expect(docs.body.length).to.be.equal(0);
  });
});

describe("POST /patients/appointments/:id", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("creates an appointment for a patient which has no previous appointments and gets the data for all existing appointments for that patient", async function() {
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Alex Beloshevsky",
        ownerPhoneNumber: "0506678419"
      });

    let docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .post("/patients/appointments/" + docs.body[0]._id)
      .send({
        startTime: "2016-05-18T16:00:00.000Z",
        endTime: "2016-05-18T18:00:00.000Z",
        description: "test appointment",
        feePaid: false,
        cost: 10
      })
      .expect(200)
      .expect("Content-Type", /json/);

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);
    expect(Array.isArray(docs.body[0].appointments)).to.be.equal(true);
    expect(docs.body[0].appointments.length).to.be.equal(1);
  });
});

describe("POST /patients/appointments/:id/:apt_id", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("creates an appointment for a patient which has no previous appointments and updates the details of the appointment", async function() {
    const cost = 5;
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Alex Beloshevsky",
        ownerPhoneNumber: "0506678419"
      });

    let docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .post("/patients/appointments/" + docs.body[0]._id)
      .send({
        startTime: "2016-05-18T16:00:00.000Z",
        endTime: "2016-05-18T18:00:00.000Z",
        description: "test appointment",
        feePaid: false,
        cost: 10
      })
      .expect(200)
      .expect("Content-Type", /json/);

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .put(
        "/patients/appointments/" +
          docs.body[0]._id +
          "/" +
          docs.body[0].appointments[0]._id
      )
      .send({
        startTime: "2016-05-18T16:00:00.000Z",
        endTime: "2016-05-18T18:00:00.000Z",
        description: "test appointment",
        feePaid: false,
        cost
      });

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(docs.body[0].appointments[0].cost).to.be.equal(5);
  });
});

describe("DELETE /patients/appointments/:id/:apt_id", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("creates an appointment for a patient which has no previous appointments and deletes that appointment", async function() {
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Alex Beloshevsky",
        ownerPhoneNumber: "0506678419"
      });

    let docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .post("/patients/appointments/" + docs.body[0]._id)
      .send({
        startTime: "2016-05-18T16:00:00.000Z",
        endTime: "2016-05-18T18:00:00.000Z",
        description: "test appointment",
        feePaid: false,
        cost: 10
      })
      .expect(200)
      .expect("Content-Type", /json/);

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app).delete(
      "/patients/appointments/" +
        docs.body[0]._id +
        "/" +
        docs.body[0].appointments[0]._id
    );

    docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    expect(docs.body[0].appointments.length).to.be.equal(0);
  });
});

describe("GET /patients/unpaid/:id", function() {
  beforeEach(() => {
    return db.deleteDb();
  });
  it("returns the correct unpaid value for a specific patient", async function() {
    await request(app)
      .post("/patients/create")
      .send({
        petName: "Blackie",
        petType: "Dog",
        ownerName: "Alex Beloshevsky",
        ownerPhoneNumber: "0506678419"
      });

    let docs = await request(app)
      .get("/patients/all")
      .expect(200)
      .expect("Content-Type", /json/);

    await request(app)
      .post("/patients/appointments/" + docs.body[0]._id)
      .send({
        startTime: "2016-05-18T16:00:00.000Z",
        endTime: "2016-05-18T18:00:00.000Z",
        description: "test appointment",
        feePaid: false,
        cost: 10
      })
      .expect(200)
      .expect("Content-Type", /json/);

    docs = await request(app)
      .get("/patients/unpaid/" + docs.body[0]._id)
      .expect(200);

    expect(docs.body.sum).to.be.equal(10);
  });
});
