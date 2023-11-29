

const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const bodyrouter = require("./routes/body")

const app = express()

const PORT = 3000
const HOST = "0.0.0.0"

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// ejs 뷰 엔진 세팅
app.set("views", __dirname + "/views")
app.set("view engine", "ejs")


app.get("/ejsrender", (req,res)=>{
    // res.send("안녕하세요")

    const rand = (Math.random() * 10) % 4 
    
    console.log(Math.floor(rand))

    res.render("first",{title:"계절풍경",season:Math.floor(rand)})
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
