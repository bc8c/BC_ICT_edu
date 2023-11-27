

const express = require("express")

const app = express()

const PORT = 3000
const HOST = "0.0.0.0"


app.get("/bc_class", (req, res)=>{
    
    console.log(req.query.name)
    console.log(req.query.age)
    res.send(`환영합니다 블록체인 클래스 수강생(이름:${req.query.name},나이:${req.query.age})`)
})

app.get("/test", (req, res)=>{
    console.log(req)
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)