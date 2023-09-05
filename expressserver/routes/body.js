
const path = require("path");
var express = require('express');
var router = express.Router();

router.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "views", "body.html"));
})

router.post('/data', (req,res)=>{
    const name = req.body.name;
    const age = req.body.age;

    console.log(name, age);
    res.send(`<h1>name : ${name}, age : ${age}</h1>`)
})

router.post('/scriptdata', (req,res)=>{
    const name = req.body.name;
    const age = req.body.age;

    console.log(name, age);
    res_str = `{"name" : "${name}", "age" : "${age}"}`;
    res.status(200).json(JSON.parse(res_str));
})

module.exports = router;

