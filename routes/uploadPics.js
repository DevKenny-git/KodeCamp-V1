const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({dest: "public/"})
const {taskCollection} = require("../schema/taskSchema");
const { isUserLoggedIn } = require("./middlewares");
const cloudinary = require("cloudinary").v2;


router.use(isUserLoggedIn);

cloudinary.config({ 
    cloud_name: 'djwyccnia', 
    api_key: '264172746776213', 
    api_secret: process.env.cloudSecret,
    secure: true
  });

router.post("/pic", upload.single("taskPicture"), async (req, res) => {
    
    try {

        const {taskTitle, taskBody} = req.body;
        const {filename} = req.file;
        const {userId} = req.decoded;
    
        const result = await cloudinary.uploader.upload("public/" + filename, {
            folder: "task-picture"
        })
    
        const newTask = await taskCollection.create({
            taskTitle, taskBody, pictureName: result.secure_url, user: userId
        });
        res.send({
            Successful: true,
            newTask
        })
    } catch (err) {
        console.log(err);
    }
   
});


module.exports = router;
