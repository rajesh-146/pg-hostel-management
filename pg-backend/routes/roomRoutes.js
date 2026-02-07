const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const { addRoom, getMyRooms, getAvailableRooms, getAllRooms } = require("../controllers/roomController");

router.get("/", auth, getAllRooms);
router.post("/", auth, addRoom);
router.get("/my-rooms", auth, getMyRooms);
router.get("/available", auth, getAvailableRooms);

module.exports = router;
