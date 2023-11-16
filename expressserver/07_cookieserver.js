

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
app.use(cookieParser());

app.post("/in", (req, res) =>{
    console.log("in /in")
    // 회원가입DB를 구현한 모습
    const orgin_id = "TestID01"
    const origin_pw = "pw1234"

    const id = req.body.ID
    const pw = req.body.PW
    // 로그인처리 :회원가입 DB에서 입력받은 id/pw 쌍이 있는지 맞는지 비교!!
    // 확인 되었다 가정하자!!!

    if (orgin_id!=id || origin_pw!=pw){
        res_str = `{"msg":"ID 혹은 PW가 틀렸습니다."}`
        res.json(JSON.parse(res_str))
        return
    }
    
    // 쿠키(티켓)를 만들어서 res 실어서 보낸다 
    res.cookie("logincookie",{
        school: "ICT",
        class : "Blockchain",
        authorized : true
    })
    res_str = `{"msg":"ok"}`
    res.json(JSON.parse(res_str))
})

app.post("/logout", (req, res) =>{
    res.clearCookie("logincookie")
    res.sendFile(__dirname+"/views/index.html")
})

app.post("/webtoon", (req, res) =>{
    const userCookie = req.cookies["logincookie"]
    console.log(req.cookies)
    
    if (!userCookie){        
        res_str = `{"msg":"로그인부터 해주세요"}`
        res.json(JSON.parse(res_str))
        return
    } else {
        const school = req.cookies.logincookie.school
        res_str = `{"msg":"`+school+`학교 학생이시군요 환영합니다."}`
        res.json(JSON.parse(res_str))
    }
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
