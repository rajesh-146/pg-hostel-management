const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  totalBeds: {
    type: Number,
    required: true
  },
  occupiedBeds: {
    type: Number,
    default: 0
  },
  rentPerBed: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model("Room", roomSchema);
