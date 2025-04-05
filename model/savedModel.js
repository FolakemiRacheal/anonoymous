const express = require("express")
const mongoose =  require("mongoose")

const savedSchema = new mongoose.Schema({
    savedName:{
        type:"String",
        require:"true, saveName is required"
    },
    submittedAt: {
         type: Date,
          default: Date.now
         },
         
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "user"
    
    },
    })

    const savedModel  = mongoose.model("saved", savedSchema)

    module.exports= savedModel


