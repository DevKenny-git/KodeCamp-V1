const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/"})
const {taskCollection} = require("../schema/taskSchema");
const {isUserLoggedIn} = require("./middlewares");




app.use(isUserLoggedIn);

router.post("/pic", upload.single("file"), async (req, res) => {
    const {taskTitle, taskBody} = req.body;
    const {originalname} = req.file;
    const {userId} = req.decoded;
    
    const newTask = await taskCollection.create({
        taskTitle, taskBody, pictureName: originalname, user: userId
    });
    res.send({
        Successful: true,
        newTask
    })
});


module.exports = router;
