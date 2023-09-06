var express = require('express');
var router = express.Router();
var users = require('../public/javascripts/users');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('signup', {title: "회원가입"})
});

router.post('/', async function(req, res, next) {
  const {ID, PW, NM} = req.body;

  const exists = await users.fetchUser(ID)
  if(exists) {
    res.send(`이미 가입되어있는 아이디 입니다. : ${ID}`);
    return;
  }

  const newUser = {
    ID, PW, NM
  }
  await users.createUser(newUser);

  //  로그인이 된 상태 or 가입만 완료하고 로그인은 별도로 해야하는지
  res.redirect("/")
})

module.exports = router;
