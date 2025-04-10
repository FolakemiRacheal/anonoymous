// models/Submission.js
const mongoose = require('mongoose');

const submittedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  user:{
          type:mongoose.Schema.Types.ObjectId,
          ref: "user"
      
      },
});


const submittedModel = mongoose.model("submitted", submittedSchema)

module.exports = submittedModel