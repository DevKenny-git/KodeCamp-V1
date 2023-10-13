const express = require("express");
const router = express.Router();
const {userCollection} = require("../schema/userSchema")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const  {} = require("./tasks");
const { isUserLoggedIn } = require("./middlewares");
require("dotenv").config();
const {v4} = require("uuid");
const { forgetPasswordCollection } = require("../schema/forgetPassword");
const {send} = require("../utilities/sendEmail");
const joi = require("joi")


router.post("/register", async (req, res) => {
    const {fullname, email, role, password} = req.body;
    const registerVaidationSchema = joi.object({
        fullname: joi.string().required(),
        email: joi.string().email().required(),
        role: joi.string(),
        password: joi.string().min(6).required()
    });

    const {error: registerValidationError} = registerVaidationSchema.validate({fullname, email, role, password})
    if (registerValidationError) return res.send(registerValidationError);
    const salt = bcrypt.genSaltSync(10);
    
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
    const loginValidationSchema = joi.object({
        email: joi.string().email().required(),
        password: joi.string().required().min(6).max(30)
    })
    
    const {error: validationError} = loginValidationSchema.validate({email, password});

    if (validationError) return res.send(validationError);
    
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


router.post("/forget-password", async(req, res) => {
    try {
        const {email} = req.body;

        const emailValidation = joi.string().email().required().messages({
            "string.email": "Your email is not valid",
            "any.required": "'email' field is required "
        });
        
        await emailValidation.validateAsync(email);

        const user = await userCollection.findOne({email});

        if (!user) return res.status(404).send("no-user-found");

        const uid = v4();

        await forgetPasswordCollection.create({
            userId: user._id,
            token: uid
        });

        await send.sendMail({
            to: email,
            subject: "Password Reset",
            html: `
                <div>
                    <h1>Password Reset</h1>
                    <div>Click <a href="">here</a> to reset your password</div>
                    <div>or use this UID = ${uid}</div>
                </div>
            `
        })
        res.status(201).send("Message sent Successfully");

    } catch (error) {
        console.log(error);
        res.status(error.status || 500).send(error.message || "internal server error");
    }
})


router.put("/password-reset", async (req, res) => {
    try {
        const {newPassword, token} = req.body;

        const user = forgetPasswordCollection.findOne({token});

        if (!user) return res.status(404).send("invalid-token");

        const newHashPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

        await userCollection.findByIdAndUpdate(user.userId, {
            password: newHashPassword
        });

        await userCollection.findOneAndDelete({token});

        res.send({
            message: "Password changed successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(error.status || 500).send(error.message || "internal server  error");
    }
})

module.exports = router;