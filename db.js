const mongoose = require("mongoose");
const dbName = process.env.NODE_ENV === "test" ? "test" : "validNetwork";

console.log("dbNAME:" + dbName);

const deleteDb = () => {
  return;
};

const db = mongoose
  .connect(`mongodb://localhost:27017/${dbName}`, {
    autoReconnect: true,
    reconnectTries: 60,
    reconnectInterval: 10000
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
