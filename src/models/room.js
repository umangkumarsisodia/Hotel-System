const mongoose = require("mongoose");
  
const roomSchema = new mongoose.Schema({
    totalrooms: Number,
    tac: Number,
    tnac: Number,
    ac: Number,
    nac: Number
});

const Room = new mongoose.model("Room",roomSchema);

// const saveData = async() => {
//     try{
//         const data = new Room({
//             totalrooms: 500,
//             tac: 500,
//             tnac: 250,
//             ac: 500,
//             nac: 250
//         });
//         const result = await data.save();
//     }
//     catch(e){
//         console.log(e);
//     }
// }

// saveData();

module.exports = Room;