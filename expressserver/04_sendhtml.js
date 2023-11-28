

const express = require("express")
const path = require("path")

const app = express()

const PORT = 3000
const HOST = "0.0.0.0"

app.use(express.static(path.join(__dirname, "views")));

app.get("/food_kr", (req, res)=>{  
    res.sendFile(__dirname+"/views/food_kr.html")
})

app.get("/food_ch", (req, res)=>{  
    res.sendFile(__dirname+"/views/food_ch.html")
})

app.get("/food_jp", (req, res)=>{  
    res.sendFile(__dirname+"/views/food_jp.html")
})

app.get("/food_en", (req, res)=>{  
    res.sendFile(__dirname+"/views/food_en.html")
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)