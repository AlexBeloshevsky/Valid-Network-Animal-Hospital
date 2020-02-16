function AppViewModel() {
  this.allData = ko.observableArray([]);

  this.petNameForInsert = ko.observable("");
  this.petTypeForInsert = ko.observable("");
  this.ownerNameForInsert = ko.observable("");
  this.ownerPhoneNumberForInsert = ko.observable("");

  this.dbIDForUpdate = ko.observable("");
  this.petNameForUpdate = ko.observable("");
  this.petTypeForUpdate = ko.observable("");
  this.ownerNameForUpdate = ko.observable("");
  this.ownerPhoneNumberForUpdate = ko.observable("");

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
      .then(function(response) {
        console.log(response);
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
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
