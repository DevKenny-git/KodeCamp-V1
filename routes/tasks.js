const express  = require('express');
const route = express.Router();
const {taskCollection} = require("../schema/taskSchema")
const jwt = require("jsonwebtoken");
const {isUserLoggedIn, adminsOnly} = require("./middlewares")
require("dotenv").config()



route.use(isUserLoggedIn);



route.get("/", async (req, res) => {
    const tasks = await taskCollection.find({user: req.decoded.userId})
    res.json(tasks);
});


route.post("/", async (req, res) => {
    const {taskTitle, taskBody} = req.body
    const newTask = await taskCollection.create({
        taskTitle,
        taskBody,
        user: req.decoded.userId
    })
    res.json({
        isRequestSuccessfull: true,
        newTask
    })
});

route.get("/by-id/:id", async (req, res) => {
    const task = await taskCollection.findById(req.params.id);
    res.send(task);
})


route.get("/by-task-title/:title", async(req, res) => {
    const task = await taskCollection.findOne({taskTitle: req.params.title});
    
    if (!task) {
        res.status(404).send("not-found")
    }
    res.send(task);
})



route.patch("/:id", async (req, res) => {
    const updatedTask = await taskCollection.findByIdAndUpdate(req.params.id, {
        taskBody: req.body.taskBody
    }, {new: true})

    res.json({
        "message": "Task updated Successfully",
        updatedTask
    })
})

route.get("/admin/all-tasks", adminsOnly, async (req, res) => {
    const tasks = await taskCollection.find();
    res.send(tasks);
})


route.delete ("/:id", async (req, res) => {
    const note = await taskCollection.findById(req.params.id);

    if(req.decoded.userId != note.user) {
        res.status(401).send("You are not allowed to delete this task");
        return
    }
    await taskCollection.findByIdAndDelete(req.params.id);
    res.send("Task has been deleted successfully!")
})


module.exports = route; 
