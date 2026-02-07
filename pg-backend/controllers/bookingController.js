const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Rent = require("../models/Rent");

// STUDENT → BOOK BED
exports.bookBed = async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can book beds" });
    }

    const { roomId } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.occupiedBeds >= room.totalBeds) {
      return res.status(400).json({ message: "Room is full" });
    }

    await Booking.create({
      student: req.user._id,
      room: room._id
    });

    const month = new Date().toISOString().slice(0, 7);

    await Rent.create({
        student: req.user._id,
        room: room._id,
        month,
        amount: room.rentPerBed
    });

    room.occupiedBeds += 1;
    await room.save();

    res.json({ message: "Bed booked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
};

// STUDENT → GET MY BOOKED ROOMS
exports.getMyRooms = async (req, res) => {
  try {
    const bookings = await Booking.find({ student: req.user._id })
      .populate("room", "roomNumber _id owner")
      .exec();

    const rooms = bookings.map(b => ({
      _id: b.room._id,
      roomNumber: b.room.roomNumber
    }));

    res.json(rooms);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching rooms" });
  }
};
