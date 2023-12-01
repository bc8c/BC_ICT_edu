

const express = require("express")

var router = express.Router()


router.get("/registercar", async(req,res)=>{
    
    res.render("registercar")
})

router.get("/purchasecar", async(req,res)=>{
   
    res.render("purchasecar")
})

router.get("/carlist", async(req,res)=>{
    const userCookie = req.cookies[`USER`]
    console.log(userCookie) 
    
    res.render("carlist",{userclass:"admin",username:userData.username})
})


module.exports = router
