const mongoose = require("mongoose");

const rentSchema = new mongoose.Schema({
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
  month: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid"],
    default: "pending"
  }
});

module.exports = mongoose.model("Rent", rentSchema);
