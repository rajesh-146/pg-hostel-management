const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const { getMyRent, payRent, getAllRents, sendRentReminder } = require("../controllers/rentController");

router.get("/", auth, getAllRents);
router.get("/my", auth, getMyRent);
router.post("/pay", auth, payRent);
router.post("/reminder", auth, sendRentReminder);

module.exports = router;
