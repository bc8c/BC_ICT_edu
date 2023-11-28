

const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")

const app = express()

const PORT = 3000
const HOST = "0.0.0.0"

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get("/body", (req, res)=>{  
    res.sendFile(__dirname+"/views/body.html")
})

app.post("/body", (req, res)=>{
    const id = req.body.id
    const pw = req.body.pw
    console.log(req.body)
    console.log(id, pw)    
})



app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
