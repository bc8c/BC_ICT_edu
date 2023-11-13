

const express = require("express")
const bodyParser = require("body-parser");
const { stringify } = require("querystring");

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.get('/out', (req, res) => {
    
    // req 안에 있는 url부분에서 데이터를 추출 하고 싶다!
    console.log(req.query.name)
 
    console.log(req.query.age)

    const name = req.query.name
    const age = req.query.age

    res.send(`name:${name} age:${age}`)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
