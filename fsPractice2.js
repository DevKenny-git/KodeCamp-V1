const express = require("express");

const port = process.env.PORT || 3000;
const app = express();


app.use((req, res, next) => {
    console.log(req.method);
    next();
})

app.use(express.json());

app.get("/hello", function (req, res) {
    res.send("Hello There");
});

app.get("/user/:username", (req, res) => {
    console.log(req.params.username);
    res.send("Hello " + req.params.username);
})


app.post("/login", (req, res) => {
    console.log(req.body);
    res.json(req.body)
})

app.listen(port, () => {
    console.log("Listening on port ", port);
})

