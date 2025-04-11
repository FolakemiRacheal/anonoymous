const express = require("express")
const mongoose = require("mongoose")
// const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel");
const savedModel = require("../model/savedModel");
const submittedModel = require("../model/submittedModel")
const crypto = require('crypto');
const joi = require("joi");


exports.signUp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        message: "Please enter all details",
      });
    }

    let existingUser = await userModel.findOne({ phoneNumber });

    if (!existingUser) {
      existingUser = new userModel({ phoneNumber });
      await existingUser.save();
    }

    const uniqueLink = `http://localhost:2450/api/v1/user/${existingUser._id}`;
    existingUser.uniqueLink = uniqueLink;
    await existingUser.save();

    res.status(200).json({
      message: "User link generated successfully",
      data: {
        uniqueLink: uniqueLink,
        userId: existingUser._id,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Other functions remain unchanged
















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


//get common names
exports.getSubmittedData = async (req, res) => {
  const { userId } = req.params;

  try {
    const submissions = await savedModel.find({ user: userId });

    if (!submissions || submissions.length === 0) {
      return res.status(404).json({ message: 'No submissions found' });
    }

    const nameCount = {};
    submissions.forEach(sub => {
      const name = sub.savedName.toLowerCase().trim();
      nameCount[name] = (nameCount[name] || 0) + 1;
    });

    let mostCommonName = null;
    let maxCount = 0;

    for (const name in nameCount) {
      if (nameCount[name] > maxCount) {
        maxCount = nameCount[name];
        mostCommonName = name;
      }
    }

    res.json({ mostCommonName, count: maxCount, allNames: nameCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
