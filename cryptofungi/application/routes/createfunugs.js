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


router.post('/feed', async function(req, res, next) {
  const fungusid = req.body.fungusid;
  const feedid = req.body.feedid;

  const userCookie = req.cookies["USER"];
  const userdata = JSON.parse(userCookie);

  var args = [fungusid, feedid]

  // 블록체인에 접근하여 CreateRandomFungus 함수를 호출하과 결과를 사용함.
  CCresult = await cc.cc_call(userdata.userid, "Feed", args);
  console.log(CCresult);
  res.redirect("/");
});

router.post('/transfer', async function(req, res, next) {

  const {fungusid,from,to} = req.body

  const userCookie = req.cookies["USER"];
  const userdata = JSON.parse(userCookie);

  var args = [from, to, fungusid]

  // 블록체인에 접근하여 CreateRandomFungus 함수를 호출하과 결과를 사용함.
  CCresult = await cc.cc_call(userdata.userid, "TransferFrom", args);
  console.log(CCresult);
  res.redirect("/");
});

module.exports = router;
