require("dotenv").config();
var cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const res = require('express/lib/response');
const loginSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

loginSchema.methods.generateToken = async function() {
    try {
        const token = jwt.sign({_id : this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }
    catch(e) {
        console.log(e);
    }
}

const Employee = new mongoose.model("Employee", loginSchema);

const setData = async() => {
    try{
        const data1 = new Employee ({
            userId : "rakesh@sisodia.com",
            name: "Rakesh Kumar",
            phone: 9781562345,
            password: "rakesh@123"
        })
        const data2 = new Employee ({
            userId : "mahesh@sisodia.com",
            name: "Mahesh Kumar",
            phone: 9856231255,
            password: "mahesh@123"
        })
        const result = await Employee.insertMany([data1, data2]);
        const token1 = await data1.generateToken();
        const token2 = await data2.generateToken();
        res.cookie("jwt", token1);
        res.cookie("jwt", token2);
    }
    catch(e) {
        console.log(e);
    }
}

// setData();




module.exports = Employee;