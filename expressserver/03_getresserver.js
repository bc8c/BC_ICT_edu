

const express = require("express")

const app = express()

const PORT = 3000
const HOST = "0.0.0.0"


app.get("/bc_class", ()=>{
    console.log("in /bc_class")
})

app.get("/test", ()=>{
    console.log("in /test")
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)