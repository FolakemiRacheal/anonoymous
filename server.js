// const express = require("express")
// const mongoose = require("mongoose")
// const router = require("./router/userRouter")
// require("dotenv").config()
// PORT = process.env.PORT
// dataBaseUrl = process.env.dataBaseUrl

// app.use(cors());
// app.options("*", cors());


// const app = express()
// app.use(express.json())


// app.use("/api/v1/user/", router)

// mongoose.connect(dataBaseUrl).then(()=>{
// console.log("successful connection to database")
// })
// .catch(()=>{
//     console.log("error connecting to database")
// })

// app.listen(PORT, ()=>{
//     console.log(`app is up and running on ${PORT}`)
// })

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express(); // 🔹 Define app before using it

const router = require("./router/userRouter");

const PORT = process.env.PORT ;
const dataBaseUrl = process.env.dataBaseUrl;

// Enable CORS
app.use(cors());
app.options("*", cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/user/", router);

// Connect to MongoDB
mongoose
  .connect(dataBaseUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Successfully connected to database"))
  .catch((err) => console.error("❌ Error connecting to database:", err));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


