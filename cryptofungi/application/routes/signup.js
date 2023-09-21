var express = require('express');
var router = express.Router();
var users = require('../public/javascripts/users')
var cert = require('../public/javascripts/cert')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});

router.post('/', async function(req, res, next) {
  
  // Json 파일로 입출력!! => 회원 정보 데이터베이스
  const { userid, name, password } = req.body;
  console.log(userid, name, password);

  // 이미 존재하는 userid의 경우 체크
  const exists = await users.fetchUser(userid)
  if (exists) {
    res.send(`이미 존재하는 사용자 입니다. : ${userid}`)
    return
  }

  const newUser = { userid, name, password }

  await users.createUser(newUser)
  await cert.makeUserWallet(userid)

  res.cookie("USER", JSON.stringify(newUser))
  res.redirect('/')
});

module.exports = router;
