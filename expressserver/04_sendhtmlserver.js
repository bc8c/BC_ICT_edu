

const express = require("express")
const bodyParser = require("body-parser");

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))


app.get('/out', (req, res) => {
    res.sendFile(__dirname+"/views/example.html")
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
