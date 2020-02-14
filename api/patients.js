const express = require("express");
const PatientRouter = express.Router();
const Patient = require("../models/Patient");

//@route POST patients/create
//@desc create a new Patient

PatientRouter.post("/create", function(req, res) {
  const patient = new Patient({
    petName: req.body.petName,
    petType: req.body.petType,
    ownerName: req.body.ownerName,
    ownerPhoneNumber: req.body.ownerPhoneNumber
  });
  patient
    .save()
    .then(() => {
      res.json("Patient added successfully");
    })
    .catch(err => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send(
            "You are missing some required fields, please make sure that you fill out all the required information"
          );
      }
      res.status(400).send(err);
    });
});

// @route GET patients/
// @desc get all Patients
PatientRouter.get("/all", async (req, res) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route PUT patients/:id
// @desc change the details of an existing patient
PatientRouter.put("/:id", async (req, res) => {
  try {
    let newPatient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        petName: req.body.petName,
        petType: req.body.petType,
        ownerName: req.body.ownerName,
        ownerPhoneNumber: req.body.ownerPhoneNumber
      },
      { new: true }
    );
    res.send(newPatient);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = PatientRouter;
