const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/userSchema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  {} = require("./tasks");
const { isUserLoggedIn } = require("./middlewares");
require("dotenv").config();


router.post("/register", async (req, res) => {
  
    const salt = bcrypt.genSaltSync(10);
    const {fullname, email, role, password} = req.body
    const hashedPassword = bcrypt.hashSync(password, salt);


    
    await userCollection.create({
        fullname,
        email,
        role,
        password: hashedPassword
    });

    res.status(201).send("Created Successfully");
})

router.post("/login", async (req, res) => {
    const {email, password} = req.body;
    const userDetail = await userCollection.findOne({email});

    if (!userDetail) return res.status(404).send("User not Found");

    const doesPasswordMatch = bcrypt.compareSync(password, userDetail.password);

    if (!doesPasswordMatch) return res.status(400).send("Invalid Credential");
    const {email: userEmail, _id, role} = userDetail;
    const token = jwt.sign({
        email: userEmail,
        userId: _id,
        role: role
    }, process.env.secret);
    res.send({
        message: "Sign in Successful",
        token
    })

})

router.get("/profile", isUserLoggedIn, async(req, res) => {
    try {
        const user = await userCollection.findById(req.decoded.userId, "-password");
        res.send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send("internal server error");
    }
})
module.exports = router;