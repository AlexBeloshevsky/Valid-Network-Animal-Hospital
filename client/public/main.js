function AppViewModel() {
  this.allData = [];
}

// Activates knockout.js
ko.applyBindings(new AppViewModel());

async function getData() {
  try {
    const response = await axios.get("/patients/all");
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  getData();
});
