const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const campaignRoutes = require("./routes/campaigns")
const userRoutes = require("./routes/user")
const moongoose = require("mongoose");

app.use(bodyParser.json());

moongoose
  .connect(
    //"mongodb+srv://ralea:1Mongostar!@cluster0-dxjev.mongodb.net/test?retryWrites=true"
    "mongodb://127.0.0.1:27017/test?retryWrites=true"
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch(err => {
    // mongoose connection error will be handled here
    console.error("App starting error:", err.stack);
    process.exit(1);
  });

app.use("/api/campaigns", campaignRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
