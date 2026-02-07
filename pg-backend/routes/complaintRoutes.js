const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const { createComplaint, getComplaints, deleteComplaint } = require("../controllers/complaintController");

router.post("/", auth, createComplaint);
router.get("/", auth, getComplaints);
router.delete("/:id", auth, deleteComplaint);

module.exports = router;
