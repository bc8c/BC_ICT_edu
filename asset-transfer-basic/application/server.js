
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

app.get("/", (req,res)=>{
    res.render("index")
})

app.get("/asset/create", (req,res)=>{
    res.render("assetcreate")
})

app.get("/asset/read", (req,res)=>{
    res.render("assetread")
})

app.post("/asset/create", (req,res)=>{
    const id = req.body.ID
    const color = req.body.COLOR
    const size = req.body.SIZE
    const owner = req.body.OWNER
    const apvalue = req.body.APVALUE
    console.log("in /asset/create")
    console.log(id, color, size, owner, apvalue)

    // 자산생성 수행
    // 블록체인 네트워크에 있는 asset-transfer-basic 체인코드 호출
    // 체인코드내에 있는 CreateAsset 함수를 호출해야함

    // 블록체인 연동후 체인코드 호출이 정상적으로 잘 처리된경우 

    // 그 실행 결과를 받아와서 response를 만들어 웹 브라우저에 전달
    res_str = `{"resultcode":"success", "msg":"자산생성이 정상적으로 완료되었습니다."}`
    res.json(JSON.parse(res_str))
})

app.listen(PORT, HOST)
console.log(`Running on http://${HOST}:${PORT}`)
