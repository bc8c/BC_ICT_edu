

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

// 라우터 미들웨어 등록
app.use("/body", bodyrouter)


app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
