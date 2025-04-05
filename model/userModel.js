const mongoose = require("mongoose")
const express = require("express")

const userSchema = new mongoose.Schema({
    phoneNumber:{
        type:String,
        require:"true, phone number is require"
    },

    uniqueLink:{
        type:String,
        require:true
    },
    

})
const userModel = mongoose.model("user", userSchema)

module.exports = userModel