const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const bookSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    mname: {
        type: String
    },
    lname: {
        type: String,
        required: true
    },
    aadhar: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    address: {
        type: String,
        required: true
    },
    arrival: {
        type: Date,
        required: true
    },
    departure: {
        type: Date,
        required: true
    },
    roomtype: {
        type: String,
        required: true
    },
    rooms: {
        type: Number,
        required: true
    },
    bookinDate: {
        type: Date,
        default: Date.now
    }
});

const Booking = new mongoose.model("Booking", bookSchema);

module.exports = Booking;