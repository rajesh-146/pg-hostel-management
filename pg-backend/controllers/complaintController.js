const Complaint = require("../models/Complaint");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});


exports.createComplaint = async (req, res) => {
  try {
    const { message, room } = req.body;

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(room)) {
      return res.status(400).json({ message: "Invalid room ID" });
    }

    const complaint = await Complaint.create({
      student: req.user._id,
      message,
      room
    });

    if (!process.env.OWNER_EMAIL) {
      console.log("OWNER_EMAIL not configured in .env");
    } else if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("EMAIL_USER or EMAIL_PASS not configured in .env");
    } else {
      try {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: process.env.OWNER_EMAIL,
          subject: "New Complaint Received",
          text: `New complaint from student: ${req.user.name}\nRoom: ${room}\nMessage: ${message}`,
          html: `<h3>New Complaint</h3><p><strong>Student:</strong> ${req.user.name}</p><p><strong>Room:</strong> ${room}</p><p><strong>Message:</strong> ${message}</p>`
        });
        console.log("Complaint email sent to:", process.env.OWNER_EMAIL);
      } catch (mailErr) {
        console.log("Failed to send complaint email:", mailErr.message);
      }
    }

    res.json({ message: "Complaint sent to owner" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Complaint failed" });
  }
};

exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("student", "name email");

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: "Error fetching complaints" });
  }
};

exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid complaint ID" });
    }

    const complaint = await Complaint.findByIdAndDelete(id);
    
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    res.json({ message: "Complaint deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting complaint" });
  }
};