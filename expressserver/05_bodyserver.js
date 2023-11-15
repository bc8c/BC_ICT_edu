

const express = require("express")
const bodyParser = require("body-parser");

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.get('/body', (req, res) => {
    res.sendFile(__dirname+"/views/body.html")
})

app.post('/body', (req, res) => {


    const name = req.body.Name
    const age = req.body.Age
    // name, age 데이터를 DB 에 저장하는 코드

    // res.send(`name:${name} age:${age}`)
    res.sendFile(__dirname+"/views/bodyresult.html")

    console.log(req)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
