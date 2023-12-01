

const express = require("express")
var chaincode = require("./chaincode")

var router = express.Router()


router.get("/carlist", async(req,res)=>{
    const userCookie = req.cookies[`USER`]
    console.log(userCookie) 

    userData = JSON.parse(userCookie)

    result= await chaincode.QueryOwnedCarList(userData.userid)

    
    
    console.log(result)
    resultData = JSON.parse(result)
    if (resultData.resultcode=="failed") {
        res.render("carlist",{userclass:"user",username:userData.username, carlist:[]})
    } else {        
        res.render("carlist",{userclass:"user",username:userData.username, carlist:resultData.msg})
    }
})


module.exports = router
