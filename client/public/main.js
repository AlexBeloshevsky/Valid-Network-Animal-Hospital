function AppViewModel() {
  this.allData = ko.observableArray([]);

  this.petNameForInsert = ko.observable("");
  this.petTypeForInsert = ko.observable("");
  this.ownerNameForInsert = ko.observable("");
  this.ownerPhoneNumberForInsert = ko.observable("");

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
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());
