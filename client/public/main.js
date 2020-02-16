function AppViewModel() {
  this.allData = ko.observableArray([]).extend({ deferred: true });

  this.petNameForInsert = ko.observable("");
  this.petTypeForInsert = ko.observable("");
  this.ownerNameForInsert = ko.observable("");
  this.ownerPhoneNumberForInsert = ko.observable("");

  this.dbIDForUpdate = ko.observable("");
  this.petNameForUpdate = ko.observable("");
  this.petTypeForUpdate = ko.observable("");
  this.ownerNameForUpdate = ko.observable("");
  this.ownerPhoneNumberForUpdate = ko.observable("");

  this.dbIDForScheduling = ko.observable("");
  this.startTimeForScheduling = ko.observable("2020-02-16T16:00:00Z");
  this.endTimeForScheduling = ko.observable("2020-02-16T17:00:00Z");
  this.descriptionForScheduling = ko.observable("");

  this.dbIDForGettingAppointments = ko.observable("");
  this.specificPatientAppointments = ko
    .observableArray([])
    .extend({ deferred: true });

  this.appointmentIDForUpdate = ko.observable("");
  this.startTimeForUpdate = ko.observable("");
  this.endTimeForUpdate = ko.observable("");
  this.descriptionForUpdate = ko.observable("");
  this.paymentStatusForUpdate = ko.observable("");
  this.costForUpdate = ko.observable("");

  this.getDataForAllPatients = async function() {
    const response = await axios.get("/patients/all");
    this.allData(response.data);
  };

  this.addPatientToDB = async function() {
    axios
      .post("/patients/create", {
        petName: this.petNameForInsert(),
        petType: this.petTypeForInsert(),
        ownerName: this.ownerNameForInsert(),
        ownerPhoneNumber: this.ownerPhoneNumberForInsert()
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  this.findPatient = async function() {
    var result = this.allData().find(patient => {
      return patient._id == this.dbIDForUpdate();
    });
    this.petNameForUpdate(result.petName);
    this.petTypeForUpdate(result.petType);
    this.ownerNameForUpdate(result.ownerName);
    this.ownerPhoneNumberForUpdate(result.ownerPhoneNumber);
  };

  this.changePatientInDB = async function() {
    axios.put("/patients/" + this.dbIDForUpdate(), {
      petName: this.petNameForUpdate(),
      petType: this.petTypeForUpdate(),
      ownerName: this.ownerNameForUpdate(),
      ownerPhoneNumber: this.ownerPhoneNumberForUpdate()
    });
  };

  this.deletePatientFromDB = async function() {
    axios.delete("/patients/" + this.dbIDForUpdate());
  };

  this.addAppointmentToPatient = async function() {
    axios.post("/patients/appointments/" + this.dbIDForScheduling(), {
      startTime: this.startTimeForScheduling(),
      endTime: this.endTimeForScheduling(),
      description: this.descriptionForScheduling(),
      feePaid: false,
      cost: 10
    });
  };

  this.getAppointmentDataForPatient = async function() {
    const response = await axios.get(
      "/patients/appointments/" + this.dbIDForGettingAppointments()
    );
    this.specificPatientAppointments(response.data);
  };

  this.findAppointment = async function() {
    var result = this.specificPatientAppointments().find(appointment => {
      return appointment._id == this.appointmentIDForUpdate();
    });
    this.startTimeForUpdate(result.startTime);
    this.endTimeForUpdate(result.endTime);
    this.descriptionForUpdate(result.description);
    this.paymentStatusForUpdate(result.feePaid);
    this.costForUpdate(result.cost);
  };

  this.deleteAppointmentFromDB = async function() {
    axios.delete(
      "/patients/appointments/" +
        this.dbIDForGettingAppointments() +
        "/" +
        this.appointmentIDForUpdate()
    );
  };
  this.changeAppointmentInDB = async function() {
    axios.put(
      "/patients/appointments/" +
        this.dbIDForGettingAppointments() +
        "/" +
        this.appointmentIDForUpdate(),
      {
        startTime: this.startTimeForUpdate(),
        endTime: this.endTimeForUpdate(),
        description: this.descriptionForUpdate(),
        feePaid: this.paymentStatusForUpdate(),
        cost: this.costForUpdate()
      }
    );
  };
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
