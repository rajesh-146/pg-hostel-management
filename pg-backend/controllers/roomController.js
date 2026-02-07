const Room = require("../models/Room");

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

exports.addRoom = async (req, res) => {
  if (req.user.role !== "owner") {
    return res.status(403).json({ message: "Access denied" });
  }

  const { roomNumber, totalBeds, rentPerBed } = req.body;

  if (!roomNumber || !totalBeds || !rentPerBed) {
    return res.status(400).json({ message: "All fields required" });
  }

  const room = await Room.create({
    owner: req.user._id,
    roomNumber,
    totalBeds,
    rentPerBed
  });

  res.json(room);
};

exports.getMyRooms = async (req, res) => {
  const rooms = await Room.find({ owner: req.user._id });
  res.json(rooms);
};

exports.getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({
      $expr: { $lt: ["$occupiedBeds", "$totalBeds"] }
    }).populate("owner", "name email");

    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: "Error fetching available rooms" });
  }
};

