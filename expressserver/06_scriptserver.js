

const express = require("express")
const bodyParser = require("body-parser");

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.get('/body', (req, res) => {
    res.sendFile(__dirname+"/views/bodyscript.html")
})

app.post('/over', (req, res) => {


    const name = req.body.name
    const age = req.body.age
    // name, age 데이터를 DB 에 저장하는 코드

    res_str = `{"msg":"ok"}`
    // res_str = `{"msg":"no"}`

    res.json(JSON.parse(res_str))

    console.log(req)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
