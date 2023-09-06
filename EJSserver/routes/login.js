var express = require('express');
var router = express.Router();
var users = require('../public/javascripts/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', {title: "로그인"})
});

router.post('/', async function(req, res, next) {
  const {ID, PW} = req.body;
  console.log(ID, PW)
  // JSON 파일에서 입력받은 id로 회원 정보를 조회해 옴
  const user = await users.fetchUser(ID)
  if(!user) {
    res.send(`가입되어있지 않은 사용자 입니다. : ${ID}`);
    return;
  }
  if (user.PW !== PW) {
    res.send(`비밀번호가 틀렸습니다.`);
    return;
  }
  
  res.cookie('USER', JSON.stringify(user));
  res.redirect("/")
}); 

module.exports = router;
