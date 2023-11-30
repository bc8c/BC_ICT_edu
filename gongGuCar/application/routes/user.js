

const express = require("express")
const fs = require("fs").promises

var router = express.Router()


router.post("/login", async(req,res)=>{
    console.log("in login")
    const {userid,userpw} = req.body

    const user = await fetchUser(userid)
    if (!user) {
        res.send("존재하지 않는 사용자입니다.")
        return
    }
    if(userpw !== user.userpw) {
        res.send("비밀번호가 틀렸습니다.")
        return
    }

    // 로그인처리 ( 쿠키생성 )
    cookie_str = `{userid:${user.userid}, username:${user.username}, level:1}`
    res.cookie("USER", cookie_str)

    res.redirect("/")
})

router.get("/logout", (req,res)=>{
    res.clearCookie("USER")
    res.redirect("/")
})


router.post("/register", (req,res)=>{
    res.render("signup")
})

router.post("/signup", async(req,res)=>{
    // 회원가입을 수행하는 루틴
    const {userid,userpw,username,userlicense,residence} = req.body
    const newUser = {userid,userpw,username,userlicense,residence}

    const exist = await fetchUser(userid)

    if (exist) {
        res.send("이미 존재하는 사용자 입니다.")
        return
    }

    await createUser(newUser)
    res.send("회원가입이 완료되었습니다.")
})

async function fetchAllUsers(){
    const usersbytes = await fs.readFile("./public/userdata/user.json")
    const users = JSON.parse(usersbytes.toString())
    return users
}

async function createUser(newUser){    
    const users = await fetchAllUsers()
    users.push(newUser)
    await fs.writeFile("./public/userdata/user.json", JSON.stringify(users))
}

async function fetchUser(userid){    
    const users = await fetchAllUsers()
    const user = users.find((users)=> users.userid === userid)
    return user
}

module.exports = router
