const mongoose = require("mongoose");
  
const feedbackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    feedback: {
        type: String,
        required: true
    }
});

const Feedback = new mongoose.model("Feedback",feedbackSchema);


module.exports = Feedback;