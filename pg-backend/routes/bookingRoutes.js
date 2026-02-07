const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const { bookBed, getMyRooms } = require("../controllers/bookingController");

router.post("/", auth, bookBed);
router.get("/my-rooms", auth, getMyRooms);

module.exports = router;
