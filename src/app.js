require("dotenv").config();
var cookieParser = require('cookie-parser')
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
require("./db/conn");
const Booking = require("./models/book");
const bodyParser = require("body-parser");
const Room = require("./models/room");
const Feedback = require("./models/feedback");
const async = require("hbs/lib/async");
const Employee = require("./models/loginmodels");
const jwt = require("jsonwebtoken")
const auth = require("./middleware/auth");



const port = 3000 || process.env.port;

const app = express();

const staticPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.use(express.static(staticPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set("view engine", "hbs");
app.set("views", viewPath);

hbs.registerPartials(partialsPath);


app.get("/", (req,res) => {
    res.render("index");
});

app.get("/about", (req,res) => {
    res.render("about");
});

app.get("/facility", (req,res) => {
    res.render("facilities");
});

app.get("/book", async(req,res) => {
    try {
        const rooms = await Room.find();
        res.render("booking", {
            ac: rooms[0].ac,
            nac: rooms[0].nac
        });
    }
    catch(e) {
       res.status("401").send(e);
    }
});

app.get("/feedback", (req,res) => {
    res.render("feedback");
});

app.post("/booked", async(req,res) => {
    try {
        const roomType = req.body.roomType;
        const totalRooms = req.body.rooms;
        const rooms = await Room.find();
        if(roomType == "ac") {
            if(rooms[0].ac > totalRooms) {
                const data = new Booking({
                    fname : req.body.fname,
                    mname : req.body.mname,
                    lname : req.body.lname,
                    aadhar : req.body.aadhar,
                    email : req.body.email,
                    phone : req.body.phone,
                    address : req.body.address,
                    arrival : req.body.arrivalDate,
                    departure: req.body.departureDate,
                    roomtype: req.body.roomType,
                    rooms: req.body.rooms
                });
                const result = await data.save();
                res.send("Room booked successfully")
                const newVal = rooms[0].ac - req.body.rooms;
                const updateRoom = await Room.updateOne({ac:newVal});
            }
            else {
                res.send(`Sorry we have only ${rooms[0].ac} rooms available`);
            }
        }

        if(roomType == "nac") {
            if(rooms[0].nac > totalRooms) {
                const data = new Booking({
                    fname : req.body.fname,
                    mname : req.body.mname,
                    lname : req.body.lname,
                    aadhar : req.body.aadhar,
                    email : req.body.email,
                    phone : req.body.phone,
                    address: req.body.address,
                    arrival : req.body.arrivalDate,
                    departure: req.body.departureDate,
                    roomtype: req.body.roomType,
                    rooms: req.body.rooms
                });
                const result = await data.save();
                res.send("Room booked successfully");
                const newVal = rooms[0].nac - req.body.rooms;
                const updateRoom = await Room.updateOne({nac:newVal});
            }
            else {
                res.send(`Sorry we have only ${rooms[0].nac} rooms available`);
            }
        }
    }
    catch(e) {
        res.status("401").send(e);
    }
})

app.post("/feedback", async(req,res)=>{
    try {
        const data = new Feedback({
            name: req.body.name,
            feedback: req.body.feedback
        });
        const result = await data.save();
        res.send("Feedback saved successfully");
    }
    catch(e) {
        res.status("401").send(e);
    }
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/signed", async(req, res) => {
    try {
        const uid = req.body.uid;
        const password = req.body.password;
        const Emp = await Employee.findOne({userId : uid});
        const rooms = await Room.find();
        const token = await Emp.generateToken();
        res.cookie("jwt", token, {
            httpOnly: true
        });
        if(Emp.password === password) {
            res.render("employeepage", {
                name: Emp.name,
                ac: rooms[0].ac,
                nac: rooms[0].nac
            });
        }
        else {
            res.send("Check your user id or password")
        }
    }
    catch(e) {
        res.status("401").send(e);
    }
})

app.get("/clients", auth, async(req,res)=>{
    try{
        const result = await Booking.find();
        res.render("clients",{
            data: result
        });
    }
    catch(e){
        res.status("401").send(e);
    }
})

app.get("/logout", auth, async(req, res) =>{
    try {
        req.user.tokens = req.user.tokens.filter((currElem)=>{
            return currElem.token !== req.token
        })
        res.clearCookie("jwt");
        await req.user.save();
        res.render("login")
    }catch(e) {
        res.status("401").send(e);
    }
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`);
});

