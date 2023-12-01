
const express = require("express")
const bodyParser = require("body-parser");
const path = require("path")
const cookieParser = require("cookie-parser")
const fs = require("fs");

const { Gateway, Wallets } = require("fabric-network");

const app = express()

const PORT = 3000;
const HOST = "0.0.0.0";

// 라우터 등록부분
var userRouter = require("./routes/user")
var adminRouter = require("./routes/admin")
var chaincodeRouter = require("./routes/chaincode")
var memberRouter = require("./routes/member")

// 미들웨어 등록부분
app.use(express.static(path.join(__dirname, "views")));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/chaincode", chaincodeRouter)
app.use("/member", memberRouter)

app.get("/", (req,res)=>{
    const userCookie = req.cookies[`USER`]
    console.log(userCookie)  

    // 로그인이 안되었을떄
    if (!userCookie){
        res.render("index")
    } else {
        // 로그인이 되었을때
        // 자신이 보유한 차량 리스트가 보이는 화면으로 랜더링        
        userData = JSON.parse(userCookie)
        if (userData.userid == "admin"){
            res.redirect("/admin/carlist")
        } else {
            res.redirect("/member/carlist")
        }        
    }   
})


app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
