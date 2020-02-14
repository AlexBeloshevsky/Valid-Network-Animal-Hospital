const mongoose = require("mongoose");
const Patient = require("./models/Patient");
const dbName = process.env.NODE_ENV === "test" ? "test" : "validNetwork";

console.log("dbNAME:" + dbName);

const deleteDb = () => {
  return Promise.all([Patient.remove({})]);
};

const db = mongoose
  .connect(`mongodb://localhost:27017/${dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(
    () => {
      console.log("Database is connected");
    },
    err => {
      console.log("Can not connect to the database" + err);
      throw err;
    }
  );

module.exports = { db, deleteDb };
