var express = require('express');
var router = express.Router();
var users = require('../public/javascripts/users')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/', async function(req, res, next) {
  const {userid, password} = req.body;
  console.log(userid, password)

  const user = await users.fetchUser(userid)
  if (!user) {
    res.send(`존재하지 않는 사용자 입니다. : ${userid}`)
    return
  }

  if(password != user.password){
    res.send(`비밀번호가 틀렸습니다. : ${userid}`)
    return
  }

  res.redirect('/')

});

module.exports = router;
