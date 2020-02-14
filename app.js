const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PatientRouter = require("./api/patients.js");
require("./db");
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", express.static(__dirname + "/client/public"));
app.use("/patients", PatientRouter);

app.listen(PORT, function() {
  console.log("listening on port " + PORT);
});

module.exports = app;
