const express = require("express")
const mongoose = require("mongoose")
// const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel");
const savedModel = require("../model/savedModel");
const crypto = require('crypto');
const joi = require("joi")

exports.signUp = async (req, res) => {
  try {
      const { phoneNumber } = req.body;

      if (!phoneNumber) {
          return res.status(400).json({
              message: `Please enter all details`,
          });
      }

      const existingUser = await userModel.findOne({ phoneNumber });
      if (existingUser) {
          return res.status(400).json({
              message: `User with the phone number already exists`,
          });
      }

      // Create the user first
      const user = new userModel({
          phoneNumber: phoneNumber.trim()
      });

      const uniqueLink = `http://localhost:2450/api/v1/user/${user._id}`;
      user.uniqueLink = uniqueLink; 
      await user.save();

      res.status(200).json({
          message: `User link generated successfully`,
          data: uniqueLink,
          data:user
      });

  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
  }
};

exports.getSavedContactWithUser = async (req, res) => {
  try {
      const savedContactData = await savedModel.findById(req.params.id).populate("user").setOptions({ strictPopulate: false });

      if (!savedContactData) {
          return res.status(404).json({
              message: "Contact not found",
          });
      }

      return res.status(200).json({
          message: "Contact found successfully",
          data: savedContactData
      });

  } catch (error) {
      return res.status(500).json({
          message: "Server error: " + error.message
      });
  }
};


exports.getAll = async(req, res)=>{
  const allUser = await userModel.find()
  if(!allUser){
    return res.status(404).json({
      message:"not found"
    })
  }
  return res.status(200).json({
    message:"all user contact collected successfully",
    data:allUser
  })
}

exports.getNames = async (req, res) => {
  try {
    const { userId } = req.params; 
    const names = await savedModel.find({ user: userId }).populate("user", "uniqueLink");
    if (names.length === 0) {
      return res.status(404).json({
        message: "No names found for this user"
      });
    }

    // Return the names and the user's unique link if names are found
    return res.status(200).json({
      message: "Names retrieved successfully",
      data: names // This will include the names and user uniqueLink
    });

  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
};


exports.saveName = async (req, res) => {
  try {
    const {userId} = req.params;
    const {savedName} = req.body;

    console.log("Received ID:", userId);

    // Validate the ID format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user ID format",
      });
    }

    // Ensure savedName is provided
    if (!savedName) {
      return res.status(400).json({
        message: "Please provide the name you saved this contact as",
      });
    }
    const user = await userModel.findById(userId);
    console.log("User found:", user); 
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Save the submitted name linked to the user
    const saved = await savedModel.create({
      savedName,
      user: userId, 
    });

    return res.status(200).json({
      message: "Name saved successfully!",
      data: saved,
    });
  } catch (error) {
    console.error("Error:", error); // Log error for debugging
    return res.status(500).json({
      message: "Server error: " + error.message,
    });
  }
};
