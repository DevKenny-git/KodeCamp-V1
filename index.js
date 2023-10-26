const express = require("express");
const port = process.env.PORT ||4000;
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const taskRoute = require("./routes/tasks")
const authRoute = require("./routes/auth")
const path = require("path");
const uploadPic = require("./routes/uploadPics")
const cors = require('cors');
const logger = require('morgan');
const shopRoute = require("./routes/shopItem");

const connect = mongoose.connect(process.env.mongoDBURL)

connect.then(() => {
    console.log("Connected Successfully");
}).catch((error) => {
    console.log("Could not connect to the database, reason =", error);
})

app.use(cors({
    origin: process.env.WHITELIST,
    methods: "POST, GET",
    allowedHeaders: "Authorization"
}))// origin, methods, allowHeaders

app.use(logger("short")); // dev, short, tiny, common, combined
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, "public")));

app.use("/v1/tasks", taskRoute);
app.use("/v1/auth", authRoute);
app.use("/v1/upload-pic", uploadPic);
app.use("/v1/shop-items-route", shopRoute);



app.listen(port, function() {
    console.log("Listening on port", port);
})


module.exports = app;


// 