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
      res.json(patient);
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

// @route DELETE patients/:id
// @desc delete an existing patient
PatientRouter.delete("/:id", async (req, res) => {
  try {
    let deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    res.send(deletedPatient);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route POST patients/appointments/:id
// @desc add an appointment to a specific patient
PatientRouter.post("/appointments/:id", async (req, res) => {
  let newAppointment = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    description: req.body.description,
    feePaid: req.body.feePaid,
    cost: req.body.cost
  };
  try {
    const patient = await Patient.findById(req.params.id);
    patient.appointments.push(newAppointment);
    await patient.save();
    res.json(patient);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route GET patients/appointments/:id
// @desc get all appointments for a specific patient
PatientRouter.get("/appointments/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    res.send(patient.appointments);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route PUT /appointments/:id/:apt_id
// @desc change the details of an existing patient's specific appointment
PatientRouter.put("/appointments/:id/:apt_id", async (req, res) => {
  let newAppointment = {
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    description: req.body.description,
    feePaid: req.body.feePaid,
    cost: req.body.cost
  };
  try {
    let updatedPatient = await Patient.findById(req.params.id);
    let appointmentsArray = updatedPatient.appointments.filter(appointment => {
      return appointment._id != req.params.apt_id;
    });
    appointmentsArray.push(newAppointment);
    updatedPatient.appointments = appointmentsArray;
    await updatedPatient.save();
    res.send(updatedPatient);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route DELETE /appointments/:id/:apt_id
// @desc delete an existing patient's specific appointment
PatientRouter.delete("/appointments/:id/:apt_id", async (req, res) => {
  try {
    let updatedPatient = await Patient.findById(req.params.id);
    let appointmentsArray = updatedPatient.appointments.filter(appointment => {
      return appointment._id != req.params.apt_id;
    });
    updatedPatient.appointments = appointmentsArray;
    await updatedPatient.save();
    res.send(updatedPatient);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route GET /unpaid/:id
// @desc get the total unpaid amount for a specific patient.
PatientRouter.get("/unpaid/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    let sum = 0;
    let unpaidAppointments = patient.appointments.filter(appointment => {
      return appointment.feePaid == false;
    });
    unpaidAppointments.forEach(appointment => {
      sum += appointment.cost;
    });
    res.send({ sum });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route GET /unpaid
// @desc get a list of all unpaid appointments
PatientRouter.get("/unpaid", async (req, res) => {
  try {
    const patients = await Patient.find();
    let unpaidAppointments = [];
    patients.forEach(patient => {
      patient.appointments.filter(appointment => {
        if (appointment.feePaid == false) {
          unpaidAppointments.push(appointment);
        }
      });
    });
    res.json(unpaidAppointments);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route GET patients/appointments/:id
// @desc get all appointments for a date
PatientRouter.get("/appointments", async (req, res) => {
  try {
    const requestedDate = req.query.date;
    const requestedDateMilis = Date.parse(requestedDate); // 2020-02-01
    const startTime = new Date(requestedDateMilis);
    const dayInMilis = 1000 * 24 * 60 * 60;
    const endTime = new Date(requestedDateMilis + dayInMilis - 1);

    const patients = await Patient.find({
      appointments: {
        $elemMatch: {
          startTime: { $gte: startTime },
          endTime: { $lte: endTime }
        }
      }
    });

    const appointmentsArrays = patients.map(patient =>
      patient.appointments.filter(
        appointment =>
          appointment.startTime >= startTime && appointment.endTime <= endTime
      )
    );

    const appointments = Array.prototype.concat.apply([], appointmentsArrays);

    res.send(appointments);
  } catch (err) {
    res.status(500).send(`Server Error: ${err.message}`);
  }
});

module.exports = PatientRouter;
