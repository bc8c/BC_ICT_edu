

const bodyParser = require("body-parser");
const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser')

const bodyrouter = require("./routes/body")
const cookierouter = require("./routes/cookie")

const app = express();
const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());

//-----------------------------------------------라우터 미들웨어
app.use("/body", bodyrouter);
app.use("/cookie", cookierouter);

//-----------------------------------------------라우터 직접등록
app.get('/aaa/bbb', (req, res)=>{
    const name = req.query.name
    const age = req.query.age
    
    console.log("name : " + name)
    console.log("age : " + age)
    res.send(`<h1>name : ${name}, age : ${age}</h1>`)
})

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
