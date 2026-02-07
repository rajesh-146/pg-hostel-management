const cron = require("node-cron");
const Rent = require("../models/Rent");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

cron.schedule("0 9 * * *", async () => {
  console.log("Checking pending rents (Daily at 9 AM)...");

  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("Email configuration missing. Skipping rent reminders.");
      return;
    }

    const pendingRents = await Rent.find({ status: "pending" }).populate("student");

    for (const rent of pendingRents) {
      if (!rent.student || !rent.student.email) {
        console.log("Skipping rent - missing student or email");
        continue;
      }

      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: rent.student.email,
          subject: "PG Rent Reminder",
          text: `Hi ${rent.student.name}, your rent for ${rent.month} is pending. Please pay soon.`,
        });

        console.log("Mail sent to:", rent.student.email);
      } catch (mailErr) {
        console.log("Failed to send mail to", rent.student.email, ":", mailErr.message);
      }
    }
  } catch (err) {
    console.log("Mail cron error:", err.message);
  }
});
