var express = require('express');
var router = express.Router();
var cc = require('../public/javascripts/cc')

/* GET home page. */
router.get('/', async function(req, res, next) {
  res.render('createfungus',{title: 'Express'})
});

router.post('/', async function(req, res, next) {
  const fungusname = req.body.fungusname;

  const userCookie = req.cookies["USER"];
  const userdata = JSON.parse(userCookie);
  // 블록체인에 접근하여 CreateRandomFungus 함수를 호출하과 결과를 사용함.
  CCresult = await cc.cc_call(userdata.userid, "CreateRandomFungus",fungusname);
  console.log(CCresult);
  res.redirect("/");
});



module.exports = router;
