var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  const userCookie = req.cookies["USER"];
  console.log("cookie :" + userCookie);

  if (!userCookie){
    res.redirect("/login")
    return
  }

  const userData = JSON.parse(userCookie);
  res.render('index', { title: 'Express', name: userData.NM });
});

module.exports = router;
