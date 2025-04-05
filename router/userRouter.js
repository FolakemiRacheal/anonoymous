const express = require("express")
const {signUp,getSavedContactWithUser,getNames,getAll,saveName,}= require("../controller/userController")

const router = express.Router()

router.post("/signUp", signUp)
router.get("/getSavedContactWithUser/:id", getSavedContactWithUser)
router.post("/saveName/:userId",saveName)
router.get("/getAll",getAll)
router.get("/getNames/:userId",getNames) 


module.exports = router