var express = require('express');
var router = express.Router();
var cc = require('../public/javascripts/cc')

/* GET home page. */
router.get('/', async function(req, res, next) {

  const userCookie = req.cookies["USER"]

  console.log(userCookie)
  

  // 로그인이 안되어 있는 경우
  if (!userCookie){
    res.render('users', { title: 'Express'});    
  } else { //로그인이 되어있는 경우

    // 블록체인에 접근해서 내가 보유하고 있는 버섯을 모두 조회 해온다.
    // 그 결과를 CCresult 변수에 넣어서 res에 담아서 보낸다.
    const userdata = JSON.parse(userCookie)

    CCresult = await cc.cc_call(userdata.userid, "GetFungiByOwner","")

    console.log(CCresult)
       
    res.render('index', { title: 'Express', username: userdata.name, result:CCresult });
  }
});

router.get('/logout', function(req, res, next) {
  res.clearCookie("USER")
  res.redirect('/')
});

module.exports = router;
