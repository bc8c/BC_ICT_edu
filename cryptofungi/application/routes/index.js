var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const userCookie = req.cookies["USER"]

  console.log(userCookie)
  

  // 로그인이 안되어 있는 경우
  if (!userCookie){
    res.render('users', { title: 'Express'});    
  } else { //로그인이 되어있는 경우
    const userdata = JSON.parse(userCookie)
    res.render('index', { title: 'Express', username: userdata.name });
  }
});

router.get('/logout', function(req, res, next) {
  res.clearCookie("USER")
  res.redirect('/')
});

module.exports = router;
