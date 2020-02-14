const mongoose = require("mongoose");

const Patient = new mongoose.Schema({
  petName: { type: String, required: true },
  petType: { type: String },
  ownerName: { type: String, required: true },
  ownerPhoneNumber: { type: Number, required: true },
  appointments: [
    {
      startTime: Date,
      endTime: Date,
      description: String,
      feePaid: Boolean,
      cost: Number
    }
  ]
});

module.exports = mongoose.model("Patient", Patient);
