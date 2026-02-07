const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  room: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Room",
    required: true
  },
  bookedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Booking", bookingSchema);
