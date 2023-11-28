
var express = require("express")
var router = express.Router();
const path = require("path");


router.post("/data", (req, res)=>{
    const id = req.body.id
    const pw = req.body.pw
    console.log(req.body)
    console.log(id, pw)    
})

router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "views", "body.html"));
})

router.get("/cancle", (req, res)=>{
    res.sendFile(path.join(__dirname, "..", "views", "index.html"));
})

router.post("/scriptdata", (req, res)=>{
    const id = req.body.id
    const pw = req.body.pw
    console.log(id, pw)
    res_str = `{"id":"${id}", "pw":"${pw}"}`
    res.json(JSON.parse(res_str))
})


module.exports = router