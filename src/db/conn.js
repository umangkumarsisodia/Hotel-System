const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/hotel-data")
.then(() => {
    console.log("connection suceessfull");
})
.catch((e) => {
    console.log(e);
});

