

const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//-----------------------------------------------라우터 
app.get('/aaa/bbb', (req, res)=>{
    const name = req.query.name
    const age = req.query.age
    
    console.log("name : " + name)
    console.log("age : " + age)
    res.send(`<h1>name : ${name}, age : ${age}</h1>`)
})

app.get('/body', (req, res)=>{
    res.sendFile(__dirname+ "/views/body.html")
})

app.post('/body/data', (req,res)=>{
    const name = req.body.name;
    const age = req.body.age;

    console.log(name, age);
    res.send(`<h1>name : ${name}, age : ${age}</h1>`)
})

app.post('/body/scriptdata', (req,res)=>{
    const name = req.body.name;
    const age = req.body.age;

    console.log(name, age);
    res_str = `{"name" : "${name}", "age" : "${age}"}`;
    res.status(200).json(JSON.parse(res_str));
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

