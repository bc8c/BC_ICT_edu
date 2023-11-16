
const express = require("express")
const bodyParser = require("body-parser");
const path = require("path")
const cookieParser = require("cookie-parser")

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// app.get("/welcom", (req, res) =>{
//     const num = req.query.num
//     res.render("welcom",{count:num, name:"홍길동"})
// })

app.get("/", (req,res)=>{
    res.render("index")
})

app.get("/asset/create", (req,res)=>{
    res.render("assetcreate")
})


app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
