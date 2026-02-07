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

exports.getAllRents = async (req, res) => {
  try {
    const rents = await Rent.find()
      .populate("student", "name email")
      .populate("room", "roomNumber");

    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rents" });
  }
};

exports.getMyRent = async (req, res) => {
  try {
    const rents = await Rent.find({ student: req.user._id })
      .populate("room", "roomNumber rentPerBed");

    res.json(rents);
  } catch (err) {
    res.status(500).json({ message: "Error fetching rent" });
  }
};

exports.payRent = async (req, res) => {
  try {
    const { rentId } = req.body;

    const rent = await Rent.findById(rentId);
    if (!rent) {
      return res.status(404).json({ message: "Rent record not found" });
    }

    if (rent.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" });
    }

    rent.status = "paid";
    await rent.save();

    res.json({ message: "Rent paid successfully" });
  } catch (err) {
    res.status(500).json({ message: "Payment failed" });
  }
};

exports.sendRentReminder = async (req, res) => {
  try {
    const { rentId, studentEmail, studentName, month } = req.body;

    if (!studentEmail) {
      return res.status(400).json({ message: "Student email not found" });
    }

    const rent = await Rent.findById(rentId);
    if (!rent) {
      return res.status(404).json({ message: "Rent record not found" });
    }

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: studentEmail,
          subject: `Rent Payment Reminder for ${month}`,
          text: `Hi ${studentName},\n\nThis is a friendly reminder that your rent for ${month} is pending.\n\nPlease pay your rent as soon as possible.\n\nThank you!\n\nPG Management System`,
          html: `<h3>Rent Payment Reminder</h3><p>Hi ${studentName},</p><p>This is a friendly reminder that your rent for <strong>${month}</strong> is pending.</p><p>Please pay your rent at your earliest convenience.</p><p>Thank you!</p><p>PG Management System</p>`
        });

        res.json({ message: "Reminder sent to student" });
      } catch (mailErr) {
        console.log("Email error:", mailErr.message);
        res.status(500).json({ message: "Failed to send email" });
      }
    } else {
      res.status(500).json({ message: "Email configuration missing" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error sending reminder" });
  }
};
