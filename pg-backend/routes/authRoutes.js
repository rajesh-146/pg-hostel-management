const express = require("express");
const router = express.Router();
const { register, login, getAllUsers } = require("../controllers/authController");
const auth = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/users", auth, getAllUsers);

module.exports = router;
