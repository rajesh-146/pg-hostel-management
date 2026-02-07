const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema({
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
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved"],
    default: "open"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Complaint", complaintSchema);
