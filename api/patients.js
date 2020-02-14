const express = require("express");
const PatientRouter = express.Router();
const Patient = require("../models/Patient");

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

module.exports = PatientRouter;
