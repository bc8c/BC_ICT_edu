

const express = require("express")

var router = express.Router()


router.get("/registercar", async(req,res)=>{
    
    res.render("registercar")
})

router.get("/purchasecar", async(req,res)=>{
   
    res.render("purchasecar")
})


module.exports = router
