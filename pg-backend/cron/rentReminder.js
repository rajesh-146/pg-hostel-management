const cron = require("node-cron");
const Rent = require("../models/Rent");
const transporter = require("../config/mail");
const User = require("../models/User");

cron.schedule("0 9 * * *", async () => {
  console.log("Running rent reminder job...");

  const pending = await Rent.find({ status: "pending" })
    .populate("student", "email name")
    .populate("room", "roomNumber");

  for (let rent of pending) {
    if (!rent.student?.email) continue;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: rent.student.email,
      subject: "PG Rent Reminder",
      text: `Hello ${rent.student.name}, your rent for room ${rent.room.roomNumber} is pending.`
    });

    console.log("Reminder sent to", rent.student.email);
  }
});
